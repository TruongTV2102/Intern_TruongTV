import Fastify from "fastify";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import fastifyCors from "@fastify/cors";
import bookRoutes from "./bookmanager/index.js";
import loginRoutes from "./login/index.js";

const fastify = Fastify({ logger: true });

const ajv = new Ajv({ allErrors: true, strict: false }); // Bật allErrors để nhận tất cả lỗi
ajvErrors(ajv); // Kích hoạt ajv-errors

fastify.setValidatorCompiler(({ schema }) => {
  return ajv.compile(schema);
});

fastify.register(fastifyCors, {
  origin: "http://localhost:9000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "api-key", "user-id"],
});

fastify.register(bookRoutes);
fastify.register(loginRoutes);

export default fastify;
