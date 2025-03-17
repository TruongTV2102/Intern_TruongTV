import { registerSchema, changePasswordSchema } from "./schema.js";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
} from "./service.js";

export default async function userRoutes(fastify) {
  // Đăng ký
  fastify.post(
    "/register",
    { schema: { body: registerSchema } },
    async (req, reply) => {
      const { email, password, confirmpassword, name, birthday, phone, role } =
        req.body;
      if (password !== confirmpassword) {
        return reply
          .status(400)
          .send({ error: "Mật khẩu xác nhận không khớp" });
      }

      try {
        const newUserId = await createUser({
          email,
          password,
          name,
          birthday,
          phone,
          role,
        });

        return reply
          .status(201)
          .send({ message: "Đăng ký thành công", userId: newUserId });
      } catch (error) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  // Lấy danh sách người dùng
  fastify.get("/users", async (req, reply) => {
    try {
      const users = await getUsers();
      return reply.send(users);
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  // Cập nhật thông tin người dùng
  fastify.put("/users/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const updatedRows = await updateUser(id, req.body);
      if (updatedRows) {
        return reply.send({ message: "Cập nhật thành công" });
      } else {
        return reply.status(404).send({ error: "Người dùng không tồn tại" });
      }
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  // Xóa người dùng
  fastify.delete("/users/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const deletedRows = await deleteUser(id);
      if (deletedRows) {
        return reply.send({ message: "Xóa người dùng thành công" });
      } else {
        return reply.status(404).send({ error: "Người dùng không tồn tại" });
      }
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi server" });
    }
  });

  // Đổi mật khẩu
  fastify.post(
    "/change-password",
    { schema: changePasswordSchema },
    async (req, reply) => {
      const { email, oldPassword, newPassword } = req.body;

      try {
        const message = await changePassword(email, oldPassword, newPassword);
        return reply.send({ message });
      } catch (error) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}
