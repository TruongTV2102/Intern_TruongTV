import db from "../../config/db.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";
import {
  bookHistorySchema,
  historyQuerySchema,
  userHistorySchema,
} from "./schema.js";

export default async function historyRoutes(fastify) {
  // Xem lịch sử mượn sách (chỉ user đó hoặc admin mới được xem)
  fastify.get(
    "/history/user/:user_id",
    {
      schema: { querystring: userHistorySchema },
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const { user_id } = req.params;
      const { role, id: currentUserId } = req.user; // Lấy thông tin user từ token
      const {
        title,
        genre,
        author,
        published_year,
        status,
        page = 1,
        limit = 8,
        sortBy = "borrow_date", // Mặc định sắp xếp theo ngày mượn
        descending = false, // Mặc định giảm dần
      } = req.query;

      const offset = (page - 1) * limit;
      const order = descending ? "desc" : "asc";

      // Nếu không phải admin thì chỉ được xem lịch sử của chính mình
      if (role !== "admin" && currentUserId !== Number(user_id)) {
        return reply.status(403).send({
          error: "Forbidden",
          message: "Bạn không có quyền xem lịch sử của người khác.",
        });
      }

      const historyQuery = db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("books", "books.id", "borrow_items.book_id")
        .join("genres", "genres.id", "books.genre_id")
        .where("borrow_requests.user_id", user_id)
        .select(
          "books.id as book_id",
          "books.cover_image_url",
          "books.author",
          "genres.name as genre",
          "books.title",
          "books.published_year",
          "borrow_items.status",
          "borrow_requests.created_at",
          "borrow_items.borrow_date",
          "borrow_items.return_date",
          "borrow_items.due_date",
          "borrow_items.id"
        )
        .modify((query) => {
          if (title) query.whereILike("books.title", `%${title}%`);
          if (genre) query.whereILike("genres.name", `%${genre}%`);
          if (author) query.whereILike("books.author", `%${author}%`);
          if (published_year)
            query.where("books.published_year", published_year);
          if (status) query.where("borrow_items.status", status);
        })
        .orderBy(sortBy, order)
        .limit(limit)
        .offset(offset);

      const history = await historyQuery;

      const [{ total }] = await db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("books", "books.id", "borrow_items.book_id")
        .join("genres", "genres.id", "books.genre_id")
        .where("borrow_requests.user_id", user_id)
        .modify((query) => {
          if (genre) query.whereILike("genres.name", genre);
          if (author) query.whereILike("books.author", `%${author}%`);
          if (title) query.whereILike("books.title", `%${title}%`);
          if (published_year)
            query.where("books.published_year", published_year);
          if (status) query.where("borrow_items.status", status);
        })
        .count("borrow_items.id as total");

      return { history, total };
    }
  );

  // Xem lịch sử mượn sách của từng sách (chỉ admin được xem)
  fastify.get(
    "/history/book/:book_id",
    {
      schema: { bookHistorySchema },
      preHandler: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { book_id } = req.params;

      const history = await db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("users", "users.id", "borrow_requests.user_id")
        .where("borrow_items.book_id", book_id)
        .select(
          "users.name",
          "borrow_items.status",
          "borrow_items.borrow_date",
          "borrow_items.due_date",
          "borrow_items.return_date"
        )
        .orderBy("borrow_items.borrow_date", "desc");

      return reply.send(history);
    }
  );

  // Xem toàn bộ lịch sử mượn sách (chỉ admin được xem)
  fastify.get(
    "/history/all",
    {
      preHandler: [authenticate, authorizeAdmin],
      schema: {
        querystring: historyQuerySchema,
      },
    },
    async (req, reply) => {
      const {
        user_name,
        title,
        genre,
        author,
        published_year,
        status,
        page = 1,
        limit = 10,
        sortBy = "borrow_date", // Mặc định sắp xếp theo ngày mượn
        descending = false, // Mặc định giảm dần
      } = req.query;

      const offset = (page - 1) * limit;
      const order = descending ? "desc" : "asc";

      const historyQuery = db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("users", "users.id", "borrow_requests.user_id")
        .join("books", "books.id", "borrow_items.book_id")
        .join("genres", "genres.id", "books.genre_id")
        .select(
          "borrow_items.id",
          "users.id as user_id",
          "users.name as user_name",
          "users.email as email",
          "books.id as book_id",
          "books.cover_image_url",
          "books.title",
          "books.author",
          "genres.name as genre",
          "books.published_year",
          "borrow_items.borrow_date",
          "borrow_items.due_date",
          "borrow_items.return_date",
          "borrow_items.status",
          "borrow_items.fine"
        )
        .modify((query) => {
          if (user_name) query.whereILike("users.name", `%${user_name}%`);
          if (title) query.whereILike("books.title", `%${title}%`);
          if (genre) query.whereILike("genres.name", `%${genre}%`);
          if (author) query.whereILike("books.author", `%${author}%`);
          if (published_year)
            query.where("books.published_year", published_year);
          if (status) query.where("borrow_items.status", status);
        })
        .orderBy(sortBy, order) // Áp dụng sắp xếp
        .limit(limit)
        .offset(offset);

      const history = await historyQuery;

      const [{ total }] = await db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("users", "users.id", "borrow_requests.user_id")
        .join("books", "books.id", "borrow_items.book_id")
        .join("genres", "genres.id", "books.genre_id")
        .modify((query) => {
          if (user_name) query.whereILike("users.name", `%${user_name}%`);
          if (title) query.whereILike("books.title", `%${title}%`);
          if (genre) query.whereILike("genres.name", `%${genre}%`);
          if (author) query.whereILike("books.author", `%${author}%`);
          if (published_year)
            query.where("books.published_year", published_year);
          if (status) query.where("borrow_items.status", status);
        })
        .count("borrow_items.id as total");

      return { history, total };
    }
  );
}
