import db from "../../db.js";
import bcrypt from "bcrypt";

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
  return await db("users").select(
    "id",
    "email",
    "name",
    "birthday",
    "phone",
    "role",
    "is_active"
  );
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
