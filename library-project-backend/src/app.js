import Fastify from "fastify";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import fastifyCors from "@fastify/cors";
import bookRoutes from "./bookmanager/index.js";
import loginRoutes from "./login/index.js";
import jwt from "@fastify/jwt";

const fastify = Fastify({ logger: true });

// ✅ Cấu hình AJV cho validation
const ajv = new Ajv({ allErrors: true, strict: false });
ajvErrors(ajv);
fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));

// ✅ Đăng ký plugin JWT
fastify.register(jwt, { secret: "supersecret" });

// ✅ CORS cho phép frontend truy cập
fastify.register(fastifyCors, {
  origin: "http://localhost:9000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 🔥 Thêm toàn bộ Hooks tại đây
fastify.addHook("onReady", async () => {
  fastify.log.info(" Server đã sẵn sàng!");
});

fastify.addHook("onRequest", async (req, reply) => {
  fastify.log.info(` [REQUEST] ${req.method} - ${req.url}`);
});

fastify.addHook("preParsing", async (req, reply, payload) => {
  fastify.log.info(" [PRE-PARSING] Đang xử lý dữ liệu...");
  return payload;
});

fastify.addHook("preValidation", async (req, reply) => {
  fastify.log.info(" [PRE-VALIDATION] Kiểm tra dữ liệu hợp lệ...");
});

fastify.addHook("preHandler", async (req, reply) => {
  fastify.log.info(" [PRE-HANDLER] Kiểm tra quyền hạn...");
});

fastify.addHook("preSerialization", async (req, reply, payload) => {
  fastify.log.info(" [PRE-SERIALIZATION] Chuẩn bị phản hồi...");
  return payload;
});

fastify.addHook("onSend", async (req, reply, payload) => {
  fastify.log.info(" [ON-SEND] Gửi response...");
  return payload;
});

fastify.addHook("onResponse", async (req, reply) => {
  fastify.log.info(` [ON-RESPONSE] Xử lý xong ${req.method} - ${req.url}`);
});

fastify.addHook("onError", async (req, reply, error) => {
  fastify.log.error(` [ERROR] ${error.message}`);
});

// ✅ Đăng ký routes
fastify.register(bookRoutes);
fastify.register(loginRoutes);

export default fastify;
