import { loginSchema } from "./schema.js";
import { loginUser } from "./service.js";
import Ajv from "ajv";
import addFormats from "ajv-formats"; // ✅ Import ajv-formats

export default async function loginRoutes(fastify) {
  fastify.addSchema(loginSchema);

  // Tạo instance Ajv và thêm format
  const ajv = new Ajv();
  addFormats(ajv); // ✅ Thêm hỗ trợ format như email

  const validate = ajv.compile(loginSchema);

  // Định nghĩa route đăng nhập
  fastify.post(
    "/login",
    { schema: { body: loginSchema } },
    async (request, reply) => {
      const isValid = validate(request.body);

      if (!isValid) {
        return reply
          .status(400)
          .send({ error: "Dữ liệu không hợp lệ", details: validate.errors });
      }

      const { email, password } = request.body;
      const user = loginUser(email, password);

      if (!user) {
        return reply.status(401).send({ error: "Sai email hoặc mật khẩu" });
      }

      return reply.send({ message: "Đăng nhập thành công", user });
    }
  );
}
