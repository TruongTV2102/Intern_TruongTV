import { bookSchema } from "./schema.js";
import { addBook, getBooks, updateBook, deleteBook } from "./service.js";
import { authenticate, authorizeAdmin } from "./auth.js"; // ✅ Thêm middleware auth

export default async function bookRoutes(fastify) {
  fastify.addSchema(bookSchema);

  // 📌 Lấy danh sách sách (ai cũng được phép)
  fastify.get("/books", async (req, reply) => {
    const books = await getBooks();
    return reply.send({ books });
  });

  // 📌 Thêm sách (chỉ admin)
  fastify.post(
    "/books",
    {
      schema: { body: { $ref: "bookSchema" } },
      preValidation: [authenticate, authorizeAdmin],
    }, // ✅ Kiểm tra quyền
    async (req, reply) => {
      const newBook = await addBook(req.body);
      return reply
        .status(200)
        .send({ message: "Sách đã được thêm", book: newBook });
    }
  );

  // 📌 Cập nhật sách (chỉ admin)
  fastify.put(
    "/books/:id",
    {
      schema: { body: { $ref: "bookSchema" } },
      preValidation: [authenticate, authorizeAdmin],
    }, // ✅ Kiểm tra quyền
    async (req, reply) => {
      const updatedBook = await updateBook(req.params.id, req.body);
      if (!updatedBook)
        return reply.status(404).send({ error: "Không tìm thấy sách" });
      return reply.send({
        message: "Sách đã được cập nhật",
        book: updatedBook,
      });
    }
  );

  // 📌 Xóa sách (chỉ admin)
  fastify.delete(
    "/books/:id",
    { preValidation: [authenticate, authorizeAdmin] }, // ✅ Kiểm tra quyền
    async (req, reply) => {
      const success = await deleteBook(req.params.id);
      if (!success)
        return reply.status(404).send({ error: "Không tìm thấy sách" });
      return reply.send({ message: "Sách đã được xóa" });
    }
  );
}
