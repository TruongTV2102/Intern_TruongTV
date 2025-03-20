import {
  registerSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "./schema.js";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
  resetPassword,
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
        throw new Error("Mật khẩu xác nhận không khớp");
      }

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
    }
  );

  // Lấy danh sách người dùng
  fastify.get("/users", async (req, reply) => {
    return getUsers();
  });

  // Cập nhật thông tin người dùng
  fastify.put("/users/:id", async (req, reply) => {
    const { id } = req.params;
    const updatedRows = await updateUser(id, req.body);
    if (!updatedRows) throw new Error("Người dùng không tồn tại");

    return reply.send({ message: "Cập nhật thành công" });
  });

  // Xóa người dùng
  fastify.delete("/users/:id", async (req, reply) => {
    const { id } = req.params;
    const deletedRows = await deleteUser(id);
    if (!deletedRows) throw new Error("Người dùng không tồn tại");

    return reply.send({ message: "Xóa người dùng thành công" });
  });

  // Đổi mật khẩu
  fastify.post(
    "/change-password",
    { schema: changePasswordSchema },
    async (req, reply) => {
      const { email, oldPassword, newPassword } = req.body;
      return { message: await changePassword(email, oldPassword, newPassword) };
    }
  );

  //Reset mật khẩu
  fastify.post(
    "/reset-password",
    { schema: { body: resetPasswordSchema } },
    async (req, reply) => {
      try {
        const { email } = req.body;
        const message = await resetPassword(fastify, email);
        return reply.send({ message });
      } catch (error) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );
}
