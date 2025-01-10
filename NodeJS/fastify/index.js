import Fastify from "fastify";
import userRouter from './src/routes/user.js'

const fastify = new Fastify({
    logger: true,
});

fastify.register(userRouter);

fastify.get("/", (req, res) => {
    return {
        message: "Welcome to hihihaha"
    };
});

const start = async () => {
    try {
      await fastify.listen({ port: 3000 });
      console.log('Server is running at http://localhost:3000');
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

start();