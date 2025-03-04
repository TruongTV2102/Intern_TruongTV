import { registerSchema } from "./schema.js";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "users.json");

// Đọc dữ liệu từ file JSON
const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  } catch (error) {
    return [];
  }
};

// Ghi dữ liệu vào file JSON
const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

export default async function authRoutes(fastify) {
  fastify.addSchema({
    $id: "registerSchema",
    ...registerSchema,
  });

  fastify.post(
    "/register",
    {
      schema: { body: { $ref: "registerSchema" } },

      // onRequest - Chạy đầu tiên (Xác thực API Key hoặc log request)
      onRequest: async (req, reply) => {
        console.log(`[onRequest] Có request đến: ${req.raw.url}`);
      },

      // preParsing - Chỉnh sửa dữ liệu trước khi parse body
      preParsing: async (req, reply, payload) => {
        console.log(`[preParsing] Trước khi parse body`);
        return payload;
      },

      // preValidation - Validate dữ liệu (AJV tự động kiểm tra)
      preValidation: async (req, reply) => {
        console.log(`[preValidation] Kiểm tra dữ liệu đầu vào`);
      },

      // preHandler - Kiểm tra email có tồn tại không
      preHandler: async (req, reply) => {
        const { email, password, confirmpassword } = req.body;
        const users = loadUsers();

        if (users.some((user) => user.email === email)) {
          return reply.status(400).send({ error: "Email đã được đăng ký" });
        }

        if (password !== confirmpassword) {
          return reply
            .status(400)
            .send({ error: "Mật khẩu xác nhận không khớp" });
        }

        console.log(`[preHandler] Kiểm tra dữ liệu hợp lệ`);
      },
    },
    async (req, reply) => {
      // Handler chính - Lưu user vào JSON
      const users = await loadUsers();
      users.push(req.body);
      await saveUsers(users);

      console.log(`[Handler] Đăng ký thành công`);
      return reply.send({ message: "Đăng ký thành công", data: req.body });
    }
  );

  // preSerialization - Chỉnh sửa dữ liệu response trước khi gửi
  fastify.addHook("preSerialization", async (req, reply, payload) => {
    console.log(`[preSerialization] Chuẩn bị gửi response`);
    return { status: "success", ...payload };
  });

  // onSend - Chỉnh sửa response hoặc header trước khi gửi
  fastify.addHook("onSend", async (req, reply, payload) => {
    console.log(`[onSend] Response chuẩn bị gửi đi`);
    reply.header("X-Custom-Header", "FastifyHooks");
    return payload;
  });

  // onResponse - Ghi log sau khi response gửi đi
  fastify.addHook("onResponse", async (req, reply) => {
    console.log(`[onResponse] Response đã gửi xong: ${reply.statusCode}`);
  });

  // onTimeout - Xử lý request nếu bị timeout
  fastify.addHook("onTimeout", async (req, reply) => {
    console.error(`[onTimeout] Request bị timeout`);
  });

  // onError - Xử lý lỗi toàn bộ request
  fastify.addHook("onError", async (req, reply, error) => {
    console.error(`[onError] Lỗi xảy ra:`, error.message);
  });

  // onReady - Chạy sau khi server khởi động thành công
  fastify.addHook("onReady", async () => {
    console.log(`[onReady] Server Fastify đã sẵn sàng`);
  });
}
