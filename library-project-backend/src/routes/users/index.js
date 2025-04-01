import { authenticate, authorizeAdmin } from "../login/auth.js";
import {
  registerSchema,
  changePasswordSchema,
  resetPasswordSchema,
  getUsersSchema,
} from "./schema.js";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
  resetPassword,
  getUserById,
} from "./service.js";
import db from "../../config/db.js";

export default async function userRoutes(fastify) {
  // Đăng ký
  fastify.post(
    "/register",
    {
      schema: { body: registerSchema },
    },
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
  fastify.get(
    "/users",
    {
      preValidation: [authenticate, authorizeAdmin],
      schema: getUsersSchema,
    },
    async (req, reply) => {
      console.log("Query params:", req.query);
      const { email, status, page, limit, sortBy, descending } =
        req.query || {}; // Tránh lỗi undefined
      const result = await getUsers({
        email,
        status,
        page,
        limit,
        sortBy,
        descending,
      });

      return reply.send(result);
    }
  );

  fastify.get(
    "/users/:id",
    {
      preValidation: [authenticate],
    },
    async (req, reply) => {
      const { id } = req.params;
      const user = await getUserById(id);
      if (!user) throw new Error("Sách không tồn tại");
      return user;
    }
  );

  // Cập nhật thông tin người dùng
  fastify.put(
    "/users/:id",
    {
      preValidation: [authenticate],
    },
    async (req, reply) => {
      const { id } = req.params;
      const { avatar, name, birthday, phone } = req.body; // Chỉ lấy các trường cho phép sửa

      const updatedRows = await updateUser(id, {
        avatar,
        name,
        birthday,
        phone,
      });
      if (!updatedRows) throw new Error("Người dùng không tồn tại");

      return reply.send({ message: "Cập nhật thành công" });
    }
  );

  //Cập nhật status user
  fastify.put(
    "/users/status/:id",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;

      // Kiểm tra id có tồn tại không
      const user = await db("users").where({ id }).first();
      if (!user) {
        return reply.code(404).send({ error: "Người dùng không tồn tại" });
      }

      // Cập nhật trạng thái status
      await db("users").where({ id }).update({ status });

      return reply.send({
        message: "Cập nhật trạng thái thành công",
        status,
      });
    }
  );

  // Xóa người dùng
  fastify.put(
    "/users/:id/delete",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await db("users")
        .where({ id })
        .update({ status: "Deleted" });

      if (result) {
        return reply.send({
          message: "User đã bị xóa",
          success: true,
        });
      } else {
        return reply
          .code(404)
          .send({ message: "User not found", success: false });
      }
    }
  );

  //Kích hoạt/ Vô hiệu hóa tài khoản

  fastify.put(
    "/users/:id/status",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body; // "Active" hoặc "Inactive"

      if (!["Active", "Inactive"].includes(status)) {
        return reply
          .code(400)
          .send({ message: "Trạng thái không hợp lệ", success: false });
      }

      const result = await db("users").where({ id }).update({ status });

      if (result) {
        return reply.send({
          message: `User đã được cập nhật thành ${status}`,
          success: true,
        });
      } else {
        return reply
          .code(404)
          .send({ message: "User không tồn tại", success: false });
      }
    }
  );

  // Đổi mật khẩu
  fastify.post(
    "/change-password",
    {
      schema: changePasswordSchema,
      preValidation: [authenticate],
    },
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
        const message = await resetPassword(fastify, req.body.email);
        return reply.send({ message });
      } catch (error) {
        return reply.status(400).send({ message: error.message });
      }
    }
  );
}
