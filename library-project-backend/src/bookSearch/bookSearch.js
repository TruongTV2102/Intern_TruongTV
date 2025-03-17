import db from "../../db.js";

export default async function bookSearchRoutes(fastify) {
  // Tìm kiếm theo tên sách
  fastify.get("/books/search/title", async (req, reply) => {
    const { title } = req.query;
    if (!title) {
      return reply.status(400).send({ error: "Vui lòng nhập tên sách" });
    }

    try {
      const books = await db("books")
        .where("title", "like", `%${title}%`)
        .select("*");
      return reply.send(books);
    } catch (error) {
      console.error("Lỗi tìm kiếm sách:", error);
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  // Tìm kiếm theo tác giả
  fastify.get("/books/search/author", async (req, reply) => {
    const { author } = req.query;
    if (!author) {
      return reply.status(400).send({ error: "Vui lòng nhập tên tác giả" });
    }

    try {
      const books = await db("books")
        .where("author", "like", `%${author}%`)
        .select("*");
      return reply.send(books);
    } catch (error) {
      console.error("Lỗi tìm kiếm sách theo tác giả:", error);
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  // Tìm kiếm theo năm xuất bản
  fastify.get("/books/search/year", async (req, reply) => {
    const { year } = req.query;
    if (!year || isNaN(year)) {
      return reply.status(400).send({ error: "Vui lòng nhập năm hợp lệ" });
    }

    try {
      const books = await db("books").where("published_year", year).select("*");
      return reply.send(books);
    } catch (error) {
      console.error("Lỗi tìm kiếm sách theo năm:", error);
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  // Tìm kiếm theo thể loại
  fastify.get("/books/search/genre", async (req, reply) => {
    const { genre } = req.query;
    if (!genre) {
      return reply.status(400).send({ error: "Vui lòng nhập thể loại" });
    }

    try {
      const books = await db("books")
        .where("genre", "like", `%${genre}%`)
        .select("*");
      return reply.send(books);
    } catch (error) {
      console.error("Lỗi tìm kiếm sách theo thể loại:", error);
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });
}
