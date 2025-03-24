import {
  addBook,
  getBookById,
  updateBook,
  deleteBook,
  getBooks,
} from "./service.js";
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
    const booksData = await getBooks(req.query);
    return reply.send(booksData);
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
