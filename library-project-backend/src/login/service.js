import db from "../../db.js";
import bcrypt from "bcrypt";

export async function findUser(email) {
  return await db("users").where({ email }).first();
}

export async function validatePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
