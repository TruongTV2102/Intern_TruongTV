import db from "../../config/db.js";
import bcrypt from "bcrypt";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

export async function createUser(userData) {
  const { email, password, name, birthday, phone, role } = userData;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await db("users").where({ email }).first();
  if (existingUser) {
    throw new Error("Email đã được đăng ký");
  }

  // Hash mật khẩu trước khi lưu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Chèn user mới vào database
  const [newUserId] = await db("users").insert({
    email,
    password: hashedPassword,
    name,
    birthday,
    phone,
    role: role || "user",
    is_active: false,
  });

  return newUserId;
}

export async function getUsers() {
  return await db("users")
    .select("id", "email", "name", "birthday", "phone", "is_active", "avatar")
    .where("role", "user");
}

export async function getUserById(id) {
  try {
    const user = await db("users").where({ id }).first();
    return user || null;
  } catch (error) {
    throw new Error("Lỗi khi truy vấn database");
  }
}

export async function updateUser(id, updatedData) {
  return await db("users").where({ id }).update(updatedData);
}

export async function deleteUser(id) {
  return await db("users").where({ id }).del();
}

export async function changePassword(email, oldPassword, newPassword) {
  // 🔍 Tìm user theo email
  const user = await db("users").where({ email }).first();
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // 🔐 So sánh mật khẩu cũ
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu cũ không đúng");
  }

  // 🔄 Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 📝 Cập nhật mật khẩu mới vào DB
  await db("users").where({ email }).update({ password: hashedPassword });

  return "Đổi mật khẩu thành công";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const resetPassword = async (fastify, email) => {
  // Kiểm tra email
  const user = await db("users").where({ email }).first();
  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống.");
  }

  // Tạo mật khẩu mới
  const newPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db("users").where({ email }).update({ password: hashedPassword });

  // Render email với EJS
  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../../templates/resetPassword.ejs"),
    { name: user.name, newPassword }
  );

  // Gửi email với text và HTML
  await fastify.mailer.sendMail({
    from: "truong9x00z@gmail.com",
    to: user.email,
    subject: "Đặt lại mật khẩu thành công",
    text: `Xin chào ${user.name},\n\nMật khẩu mới của bạn là: ${newPassword}\n\nVui lòng đăng nhập và đổi lại mật khẩu ngay để đảm bảo an toàn.\n\nCảm ơn!`,
    html: htmlContent,
  });

  return "Mật khẩu mới đã được gửi đến email của bạn.";
};
