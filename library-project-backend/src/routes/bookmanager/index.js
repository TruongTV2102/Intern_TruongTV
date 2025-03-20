import { addBook, getBookById, updateBook, deleteBook } from "./service.js";
import { bookSchema } from "./schema.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";
import db from "../../config/db.js";

export default async function bookRoutes(fastify) {
  // Thêm sách
  fastify.post(
    "/books",
    {
      schema: { body: bookSchema },
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      return { bookId: await addBook(req.body) };
    }
  );

  // Lấy danh sách tất cả sách
  fastify.get("/books", async (req, reply) => {
    const {
      title,
      genre,
      author,
      published_year,
      page = 1,
      limit = 8,
    } = req.query;

    const offset = (page - 1) * limit; // Tính toán offset cho phân trang

    // Truy vấn dữ liệu sách với các bộ lọc
    const booksQuery = db("books")
      .leftJoin("genres", "books.genre_id", "genres.id")
      .select(
        "books.id",
        "books.title",
        "books.author",
        "books.published_year",
        "books.quantity",
        "books.total_quantity",
        "books.cover_image_url",
        "genres.name as genre_name"
      )
      .limit(limit)
      .offset(offset);

    // Thêm điều kiện lọc nếu có
    if (genre) {
      booksQuery.whereILike("genres.name", genre);
    }
    if (author) {
      booksQuery.whereILike("books.author", `%${author}%`);
    }
    if (title) {
      booksQuery.whereILike("books.title", `%${title}%`);
    }
    if (published_year) {
      booksQuery.where("books.published_year", published_year);
    }

    // Lấy danh sách sách
    const books = await booksQuery;

    // Đếm tổng số sách phù hợp với bộ lọc
    const [{ total }] = await db("books")
      .leftJoin("genres", "books.genre_id", "genres.id")
      .modify((query) => {
        if (genre) query.whereILike("genres.name", genre);
        if (author) query.whereILike("books.author", `%${author}%`);
        if (title) query.whereILike("books.title", `%${title}%`);
        if (published_year) query.where("books.published_year", published_year);
      })
      .count("books.id as total");

    return { books, total };
  });

  // Lấy chi tiết một cuốn sách
  fastify.get("/books/:id", async (req, reply) => {
    const { id } = req.params;
    const book = await getBookById(id);
    if (!book) throw new Error("Sách không tồn tại");
    return book;
  });

  // Cập nhật sách
  fastify.put(
    "/books/:id",
    {
      schema: { body: bookSchema },
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { id } = req.params;
      const updated = await updateBook(id, req.body);
      if (!updated) throw new Error("Sách không tồn tại");
      return { message: "Cập nhật sách thành công" };
    }
  );

  // Xóa sách
  fastify.delete("/books/:id", async (req, reply) => {
    const { id } = req.params;
    await deleteBook(id);
    return reply.send({ message: "Xóa sách thành công" });
  });

  // Lấy danh sách genre
  fastify.get("/genres", async (request, reply) => {
    try {
      const genres = await db("genres").select("*");
      return reply.send(genres);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });
}
