import { getReturnRequests, confirmReturn } from "./service.js";

export default async function borrowRoutes(fastify, opts) {
  fastify.get("/return-requests", async (request, reply) => {
    try {
      const returnRequests = await getReturnRequests();
      return reply.send(returnRequests);
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi lấy dữ liệu" });
    }
  });

  fastify.post("/confirm-return", async (request, reply) => {
    const { id } = request.body;
    try {
      const result = await confirmReturn(id);
      return reply.send(result);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: error.message || "Lỗi khi xác nhận trả sách" });
    }
  });
}
