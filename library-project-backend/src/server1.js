import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";

const fastify = Fastify();
fastify.register(cors);
fastify.register(jwt, { secret: "your-secret-key" });

const users = [
  { id: 1, email: "admin@gmail.com", password: "1234567", role: "admin" },
  { id: 2, email: "user@gmail.com", password: "1234567", role: "user" },
];

fastify.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  const user = users.find((u) => u.email === email && u.password === password);
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

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log("Server running on http://localhost:3000");
});
