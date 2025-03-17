import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "./service.js";
import { bookSchema } from "./schema.js";
import { authenticate, authorizeAdmin } from "./auth.js";

export default async function bookRoutes(fastify, options) {
  // Thêm sách
  fastify.post(
    "/books",
    {
      schema: { body: bookSchema },
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      try {
        const bookId = await addBook(req.body);
        return reply.send({ bookId });
      } catch (error) {
        console.error("Create Book Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  // Lấy danh sách tất cả sách
  fastify.get("/books", async (req, reply) => {
    try {
      const books = await getBooks();
      return reply.send(books);
    } catch (error) {
      console.error("Fetch Books Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });

  // Lấy chi tiết một cuốn sách
  fastify.get("/books/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const book = await getBookById(id);
      if (!book) {
        return reply.code(404).send({ error: "Sách không tồn tại" });
      }
      return reply.send(book);
    } catch (error) {
      console.error("Fetch Book Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
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
      try {
        const updated = await updateBook(id, req.body);
        if (!updated) {
          return reply.code(404).send({ error: "Sách không tồn tại" });
        }
        return reply.send({ message: "Cập nhật sách thành công" });
      } catch (error) {
        console.error("Update Book Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  // Xóa sách
  fastify.delete(
    "/books/:id",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { id } = req.params;
      try {
        const deleted = await deleteBook(id);
        if (!deleted) {
          return reply.code(404).send({ error: "Sách không tồn tại" });
        }
        return reply.send({ message: "Xóa sách thành công" });
      } catch (error) {
        console.error("Delete Book Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
