import jwt from "jsonwebtoken";

export function authenticate(req, reply, done) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Gán user vào request để sử dụng sau này
    done();
  } catch (error) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export function authorizeAdmin(req, reply, done) {
  if (req.user?.role !== "admin") {
    return reply.status(403).send({
      error: "Forbidden",
      message: "Bạn không có quyền thực hiện thao tác này",
    });
  }
  done();
}
