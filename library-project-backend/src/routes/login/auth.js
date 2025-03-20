export async function authenticate(req, reply) {
  try {
    await req.jwtVerify(); //  Fastify tự động lấy JWT từ header & verify
  } catch (error) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export async function authorizeAdmin(req, reply) {
  if (req.user?.role !== "admin") {
    return reply.status(403).send({
      error: "Forbidden",
      message: "Bạn không có quyền thực hiện thao tác này",
    });
  }
}
