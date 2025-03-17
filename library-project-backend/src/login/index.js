import { loginSchema } from "./schema.js";
import { findUser, validatePassword } from "./service.js";

export default async function loginRoutes(fastify, options) {
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      // 🔍 Tìm user theo email
      const user = await findUser(email);
      if (!user) {
        return reply
          .status(400)
          .send({ error: "Email hoặc mật khẩu không đúng" });
      }

      // So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
      const isMatch = await validatePassword(password, user.password);
      if (!isMatch) {
        return reply
          .status(400)
          .send({ error: "Email hoặc mật khẩu không đúng" });
      }

      // Nếu đúng, tạo token
      const token = await fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.status(200).send({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  fastify.get("/profile", async (request, reply) => {
    try {
      await request.jwtVerify();
      return reply.send({ user: request.user });
    } catch (err) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  });
}
