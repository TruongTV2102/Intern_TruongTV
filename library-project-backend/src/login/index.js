import { loginSchema } from "./schema.js";
import { findUser } from "./service.js";

export default async function loginRoutes(fastify, options) {
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;
    const user = findUser(email, password);
    if (!user)
      return reply.status(401).send({ message: "Sai tài khoản hoặc mật khẩu" });

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    reply.send({ token });
  });

  fastify.get("/profile", async (request, reply) => {
    try {
      await request.jwtVerify();
      reply.send({ user: request.user });
    } catch (err) {
      reply.status(401).send({ message: "Unauthorized" });
    }
  });
}
