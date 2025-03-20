import { loginSchema } from "./schema.js";
import { findUser, validatePassword } from "./service.js";

export default async function loginRoutes(fastify) {
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    // Tìm user theo email
    const user = await findUser(email);
    if (!user) throw new Error("Email hoặc mật khẩu không đúng");

    // Kiểm tra nếu tài khoản bị vô hiệu hóa
    if (!user.is_active)
      throw new Error("Tài khoản của bạn chưa được kích hoạt");

    // So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) throw new Error("Email hoặc mật khẩu không đúng");

    // Nếu đúng, tạo token
    const token = await fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  });

  fastify.get("/profile", async (request) => {
    await request.jwtVerify();
    return { user: request.user };
  });
}
