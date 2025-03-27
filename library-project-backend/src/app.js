import Fastify from "fastify";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";
import mailer from "./plugins/mailer.js";
import bookRoutes from "./routes/bookmanager/index.js";
import loginRoutes from "./routes/login/index.js";
import userRoutes from "./routes/users/index.js";
import borrowRoutes from "./routes/borrowRequest/index.js";
import returnRoutes from "./routes/returnrequest/index.js";
import historyRoutes from "./routes/history/index.js";

const fastify = Fastify({ logger: true });

// Cấu hình AJV cho validation
// coerceTypes dùng để ép kiểu dữ liệu vì khi truyền dữ liệu từ param sang back nó sẽ tự chuyển sang string hết
const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: true });
ajvErrors(ajv);
addFormats(ajv);
fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));

// Đăng ký plugin JWT
fastify.register(jwt, { secret: "supersecret" });

// CORS cho phép frontend truy cập
fastify.register(fastifyCors, {
  origin: "http://localhost:9000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 🔥 Thêm toàn bộ Hooks tại đây
fastify.addHook("onReady", async () => {
  fastify.log.info(" Server da san sang!");
});

fastify.addHook("onRequest", async (req, reply) => {
  fastify.log.info(` [REQUEST] ${req.method} - ${req.url}`);
});

fastify.addHook("preParsing", async (req, reply, payload) => {
  fastify.log.info(" [PRE-PARSING] Dang xu ly du lieu...");
  return payload;
});

fastify.addHook("preValidation", async (req, reply) => {
  fastify.log.info(" [PRE-VALIDATION] Kiem tra du lieu hop le...");
});

fastify.addHook("preHandler", async (req, reply) => {
  fastify.log.info(" [PRE-HANDLER] Kiem tra quyen han...");
});

fastify.addHook("preSerialization", async (req, reply, payload) => {
  fastify.log.info(" [PRE-SERIALIZATION] Chuan bị phan hoi...");
  return payload;
});

fastify.addHook("onSend", async (req, reply, payload) => {
  fastify.log.info(" [ON-SEND] Gui response...");
  return payload;
});

fastify.addHook("onResponse", async (req, reply) => {
  fastify.log.info(` [ON-RESPONSE] Xu ly xong ${req.method} - ${req.url}`);
});

fastify.addHook("onError", async (req, reply, error) => {
  fastify.log.error(`[ERROR] ${error.message}`);

  // Map lỗi tùy chỉnh
  const errorMap = {
    "Mật khẩu xác nhận không khớp": 400,
    "Người dùng không tồn tại": 400,
    "Sách không tồn tại": 400,
    "Thể loại không tồn tại": 400,
    "Tác giả không tồn tại": 400,
    "Email hoặc mật khẩu không đúng": 400,
    "Không có file upload": 400,
    Unauthorized: 400,
  };

  const statusCode = errorMap[error.message] || error.statusCode || 500;

  return reply.status(statusCode).send({
    error: error.message,
  });
});

// Đăng ký routes
fastify.register(bookRoutes);
fastify.register(loginRoutes);
fastify.register(userRoutes);
fastify.register(borrowRoutes);
fastify.register(returnRoutes);
fastify.register(historyRoutes);
fastify.register(mailer);

export default fastify;
