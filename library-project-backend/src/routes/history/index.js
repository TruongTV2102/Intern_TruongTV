import db from "../../config/db.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";

export default async function historyRoutes(fastify) {
  // Xem lịch sử mượn sách (chỉ user đó hoặc admin mới được xem)
  fastify.get(
    "/history/user/:user_id",
    { preHandler: authenticate },
    async (req, reply) => {
      const { user_id } = req.params;
      const { role, id: currentUserId } = req.user; // Lấy thông tin user từ token

      // Nếu không phải admin thì chỉ được xem lịch sử của chính mình
      if (role !== "admin" && currentUserId !== Number(user_id)) {
        return reply.status(403).send({
          error: "Forbidden",
          message: "Bạn không có quyền xem lịch sử của người khác.",
        });
      }

      const history = await db("borrow_items")
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
          "borrow_requests.borrow_date",
          "borrow_items.return_date",
          "borrow_items.due_date"
        )
        .orderBy("borrow_requests.borrow_date", "desc");

      return reply.send(history);
    }
  );

  // Xem lịch sử mượn sách của từng sách (chỉ admin được xem)
  fastify.get(
    "/history/book/:book_id",
    { preHandler: [authenticate, authorizeAdmin] },
    async (req, reply) => {
      const { book_id } = req.params;

      const history = await db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("users", "users.id", "borrow_requests.user_id")
        .where("borrow_items.book_id", book_id)
        .select(
          "users.id as user_id",
          "users.name",
          "borrow_items.status",
          "borrow_requests.borrow_date",
          "borrow_items.return_date"
        )
        .orderBy("borrow_requests.borrow_date", "desc");

      return reply.send(history);
    }
  );
}
