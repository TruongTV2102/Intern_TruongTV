import { bookSchema } from "./schema.js";
import { addBook, getBooks, updateBook, deleteBook } from "./service.js";

export default async function bookRoutes(fastify) {
  fastify.addSchema(bookSchema);

  // 📌 Hook chạy khi server khởi động xong
  fastify.addHook("onReady", async () => {
    fastify.log.info(" Server ready");
  });

  // 📌 Hook chạy trước khi xử lý request
  fastify.addHook("onRequest", async (req, reply) => {
    fastify.log.info(`[REQUEST] ${req.method} - ${req.url}`);
  });

  // 📌 Hook chạy trước khi request được xử lý
  fastify.addHook("preHandler", async (req, reply) => {
    fastify.log.info("[PRE-HANDLER] Kiểm tra quyền hạn...");
    // Ví dụ kiểm tra auth
    // if (!req.headers.authorization) {
    //   reply.status(401).send({ error: "Unauthorized" });
    // }
  });

  // 📌 Hook chạy trước khi response được gửi đi
  fastify.addHook("onResponse", async (req, reply) => {
    fastify.log.info(`[ON RESPONSE] Đã xử lý xong ${req.method} - ${req.url}`);
  });

  // 📌 Hook xử lý lỗi nếu có exception
  fastify.addHook("onError", async (req, reply, error) => {
    fastify.log.error(`[ERROR] ${error.message}`);
  });

  // 📌 Bộ xử lý lỗi toàn cục
  fastify.setErrorHandler((error, req, reply) => {
    fastify.log.error(`[ERROR] ${req.method} - ${req.url}: ${error.message}`);

    if (error.validation) {
      return reply.status(400).send({
        error: "Bad Request",
        message: "Dữ liệu không hợp lệ",
        details: error.validation,
      });
    }

    if (error.statusCode === 403) {
      return reply.status(403).send({
        error: "Forbidden",
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    }

    if (error.statusCode === 404) {
      return reply.status(404).send({
        error: "Not Found",
        message: "Không tìm thấy tài nguyên",
      });
    }

    return reply.status(500).send({
      error: "Internal Server Error",
      message: "Có lỗi xảy ra, vui lòng thử lại sau",
    });
  });

  // 📌 Thêm sách
  fastify.post(
    "/books",
    { schema: { body: { $ref: "bookSchema" } } },
    async (req, reply) => {
      const newBook = await addBook(req.body);
      return reply
        .status(201)
        .send({ message: "Sách đã được thêm", book: newBook });
    }
  );

  // 📌 Lấy danh sách sách
  fastify.get("/books", async (req, reply) => {
    const books = await getBooks();
    return reply.send({ books });
  });

  // 📌 Cập nhật sách
  fastify.put(
    "/books/:id",
    { schema: { body: { $ref: "bookSchema" } } },
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

  // 📌 Xóa sách
  fastify.delete("/books/:id", async (req, reply) => {
    const success = await deleteBook(req.params.id);
    if (!success)
      return reply.status(404).send({ error: "Không tìm thấy sách" });
    return reply.send({ message: "Sách đã được xóa" });
  });
}
