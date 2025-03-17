import Fastify from "fastify";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import fastifyCors from "@fastify/cors";
import bookRoutes from "./bookmanager/index.js";
import loginRoutes from "./login/index.js";
import borrowRoutes from "./returnrequest/index.js";
import userRoutes from "./users/index.js";
import jwt from "@fastify/jwt";
import uploadRoutes from "./uploads/upload.js";
import bookSearchRoutes from "./bookSearch/bookSearch.js";

const fastify = Fastify({ logger: true });

// Cấu hình AJV cho validation
const ajv = new Ajv({ allErrors: true, strict: false });
ajvErrors(ajv);
addFormats(ajv);
fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));

// Đăng ký plugin JWT
fastify.register(jwt, { secret: "supersecret" });

// CORS cho phép frontend truy cập
fastify.register(fastifyCors, {
  origin: "http://localhost:9000",
  methods: ["GET", "POST", "PUT", "DELETE"],
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
  fastify.log.error(` [ERROR] ${error.message}`);
});

// Đăng ký routes
fastify.register(bookRoutes);
fastify.register(loginRoutes);
fastify.register(borrowRoutes);
fastify.register(userRoutes);
fastify.register(uploadRoutes);
fastify.register(bookSearchRoutes);

export default fastify;
