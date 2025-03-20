import fastifyPlugin from "fastify-plugin";
import fastifyMailer from "fastify-mailer";
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường

export default fastifyPlugin(async function (fastify) {
  fastify.register(fastifyMailer, {
    transport: {
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey", // Phải là "apikey" cho SendGrid
        pass: process.env.SENDGRID_API_KEY, // Lấy từ biến môi trường
      },
    },
  });
  console.log(process.env.SENDGRID_API_KEY);
});
