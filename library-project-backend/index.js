import Fastify from "fastify";

const fastify = Fastify();

// API GET: Lấy danh sách sách
fastify.get("/books", async (request, reply) => {
  return [
    { id: 1, title: "Sách 1", author: "Tác giả A" },
    { id: 2, title: "Sách 2", author: "Tác giả B" },
  ];
});

// API POST: Thêm sách mới
fastify.post("/books", async (request, reply) => {
  const { title, author } = request.body;
  return { message: "Sách đã thêm", data: { title, author } };
});

// Chạy server
fastify.listen({ port: 3000 }, () => {
  console.log("Server chạy tại http://localhost:3000");
});
