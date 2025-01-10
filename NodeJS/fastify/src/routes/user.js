const createUserSchema = {
    type: "object",
}


async function userRouter(fastify, opts) {

    fastify.post("/api/users", (req, res) => {
        //validate request
        return {
            message: 'User created!!',
        };
    });
}

export default userRouter;