import db from "../../config/db.js";
import { BorrowStatus } from "../../constants/enum.js";
import { historyQuerySchema } from "../history/schema.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";
import { approveBorrowSchema, borrowRequestSchema } from "./schema.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

export default async function borrowRoutes(fastify) {
  // Gửi yêu cầu mượn sách
  fastify.post(
    "/borrow",
    {
      schema: borrowRequestSchema,
      preValidation: [authenticate],
    },
    async (req, reply) => {
      const { user_id, books } = req.body;
      if (!books || books.length === 0) {
        throw new Error("Danh sách sách không hợp lệ.");
      }

      await db.transaction(async (trx) => {
        const [borrow_id] = await trx("borrow_requests").insert({
          user_id,
          status: "Pending",
          borrow_date: new Date(), // Lưu ngày mượn hiện tại
        });

        await Promise.all(
          books.map(async (book_id) => {
            await trx("borrow_items").insert({
              borrow_id,
              book_id,
              status: BorrowStatus.PENDING,
            });
          })
        );
      });

      return reply.send({ message: "Đã gửi yêu cầu mượn sách." });
    }
  );

  // Duyệt hoặc từ chối từng quyển sách
  fastify.put(
    "/approve-borrow/:borrow_item_id",
    {
      schema: approveBorrowSchema,
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { borrow_item_id } = req.params;
      const { status, fine } = req.body;

      let borrow_id;

      await db.transaction(async (trx) => {
        // Lấy thông tin sách trong borrow_items
        const borrowItem = await trx("borrow_items")
          .where("id", borrow_item_id)
          .first();

        if (!borrowItem) {
          throw new Error("Không tìm thấy sách trong yêu cầu mượn.");
        }

        borrow_id = borrowItem.borrow_id;

        // Nếu duyệt, kiểm tra tồn kho và cập nhật số lượng sách
        if (status === BorrowStatus.APPROVED) {
          const book = await trx("books")
            .where("id", borrowItem.book_id)
            .first();
          if (!book || book.quantity < 1) {
            throw new Error("Sách đã hết hàng.");
          }
          await trx("books")
            .where("id", borrowItem.book_id)
            .decrement("quantity", 1);

          // Lấy borrow_date từ borrow_requests
          const borrowRequest = await trx("borrow_requests")
            .where("id", borrow_id)
            .select("borrow_date", "user_id")
            .first();

          if (!borrowRequest) {
            throw new Error("Không tìm thấy yêu cầu mượn.");
          }

          const borrowDate = new Date(borrowRequest.borrow_date);
          const dueDate = new Date(borrowDate);
          dueDate.setMonth(dueDate.getMonth() + 1); // Cộng thêm 1 tháng

          // Cập nhật status + due_date cho borrow_items
          await trx("borrow_items").where("id", borrow_item_id).update({
            status,
            due_date: dueDate,
          });
        } else if (status === BorrowStatus.RETURNED) {
          const return_date = new Date();
          // Nếu trả sách, cập nhật tiền phạt
          await trx("borrow_items").where("id", borrow_item_id).update({
            status,
            fine, // Cập nhật tiền phạt vào database
            return_date: return_date,
          });
        } else {
          // Nếu từ chối, chỉ cập nhật trạng thái
          await trx("borrow_items")
            .where("id", borrow_item_id)
            .update({ status });
        }

        // Kiểm tra nếu tất cả sách đã được xử lý thì cập nhật borrow_request thành Processed
        const remaining = await trx("borrow_items")
          .where("borrow_id", borrow_id)
          .where("status", "Pending");

        if (remaining.length === 0) {
          await trx("borrow_requests")
            .where("id", borrow_id)
            .update({ status: "Processed" });
        }
      });

      // Gửi email nếu yêu cầu đã được xử lý xong
      if (borrow_id) {
        const borrowRequest = await db("borrow_requests")
          .where("id", borrow_id)
          .first();

        if (borrowRequest?.status === "Processed") {
          const user = await db("users")
            .where("id", borrowRequest.user_id)
            .select("email", "name")
            .first();

          if (user) {
            const htmlContent = await ejs.renderFile(
              path.join(__dirname, "../../templates/borrowStatus.ejs"),
              { name: user.name }
            );

            await fastify.mailer.sendMail({
              from: "truong9x00z@gmail.com",
              to: user.email,
              subject: "Cập nhật trạng thái yêu cầu mượn sách",
              text: `Xin chào ${user.name},\n\nYêu cầu mượn sách của bạn đã được xử lý xong. Vui lòng kiểm tra danh sách sách đã được duyệt.\n\nCảm ơn!`,
              html: htmlContent,
            });
            console.log("Đã gửi mail");
          }
        }
      }

      return reply.send({ message: `Đã cập nhật trạng thái sách: ${status}.` });
    }
  );

  // Lấy danh sách đơn hàng
  fastify.get(
    "/borrow-requests",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const borrowRequests = await db("borrow_requests")
        .select(
          "borrow_requests.id",
          "users.email as email",
          "users.name as name",
          "borrow_requests.borrow_date",
          "borrow_requests.status"
        )
        .join("users", "user_id", "users.id")
        .orderBy("borrow_date", "desc");

      return reply.send(borrowRequests);
    }
  );

  //Lấy chi tiết đơn hàng
  fastify.get(
    "/orders/:borrow_id",
    {
      preHandler: [authenticate, authorizeAdmin],
      schema: {
        querystring: historyQuerySchema, // Giữ nguyên bộ lọc
      },
    },
    async (req, reply) => {
      const {
        title,
        genre,
        author,
        published_year,
        status,
        page = 1,
        limit = 10,
        sortBy = "borrow_date",
        descending = false,
      } = req.query;

      const { borrow_id } = req.params;
      const offset = (page - 1) * limit;
      const order = descending ? "desc" : "asc";

      const orderDetailsQuery = db("borrow_items")
        .join("borrow_requests", "borrow_requests.id", "borrow_items.borrow_id")
        .join("users", "users.id", "borrow_requests.user_id")
        .join("books", "books.id", "borrow_items.book_id")
        .join("genres", "genres.id", "books.genre_id")
        .select(
          "borrow_items.id",
          "users.id as user_id",
          "users.name as user_name",
          "books.id as book_id",
          "books.cover_image_url",
          "books.title",
          "books.author",
          "genres.name as genre",
          "books.published_year",
          "borrow_requests.borrow_date",
          "borrow_items.due_date",
          "borrow_items.return_date",
          "borrow_items.status"
        )
        .where("borrow_items.borrow_id", borrow_id)
        .modify((query) => {
          if (title) query.whereILike("books.title", `%${title}%`);
          if (genre) query.whereILike("genres.name", `%${genre}%`);
          if (author) query.whereILike("books.author", `%${author}%`);
          if (published_year)
            query.where("books.published_year", published_year);
          if (status) query.where("borrow_items.status", status);
        })
        .orderBy(sortBy, order)
        .limit(limit)
        .offset(offset);

      const orderDetails = await orderDetailsQuery;

      const [{ total }] = await db("borrow_items")
        .join("books", "books.id", "borrow_items.book_id")
        .join("genres", "genres.id", "books.genre_id")
        .modify((query) => {
          if (title) query.whereILike("books.title", `%${title}%`);
          if (genre) query.whereILike("genres.name", `%${genre}%`);
          if (author) query.whereILike("books.author", `%${author}%`);
          if (published_year)
            query.where("books.published_year", published_year);
          if (status) query.where("borrow_items.status", status);
        })
        .where("borrow_items.borrow_id", borrow_id)
        .count("borrow_items.id as total");

      if (orderDetails.length === 0) {
        return reply.code(404).send({ message: "Không tìm thấy đơn hàng" });
      }

      return { order: orderDetails, total };
    }
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  fastify.put("/approve-all/:orderId", async (request, reply) => {
    const { orderId } = request.params;
    const { status } = request.body;

    if (!["Approved", "Rejected"].includes(status)) {
      throw new Error("Trạng thái không hợp lệ"); // Fastify tự handle
    }

    // Kiểm tra xem đơn hàng có tồn tại không
    const borrowRequest = await db("borrow_requests")
      .where({ id: orderId })
      .first();
    if (!borrowRequest) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    // Lấy danh sách sách trong đơn hàng
    const borrowedBooks = await db("borrow_items")
      .where({ borrow_id: orderId })
      .select("book_id");

    // Nếu đơn hàng được duyệt thì trừ số lượng sách
    if (status === "Approved") {
      for (const item of borrowedBooks) {
        await db("books").where({ id: item.book_id }).decrement("quantity", 1);
      }
    }

    // Cập nhật trạng thái của tất cả sách trong đơn hàng
    await db("borrow_items").where({ borrow_id: orderId }).update({ status });

    // Cập nhật trạng thái tổng thể của đơn hàng
    await db("borrow_requests")
      .where({ id: orderId })
      .update({ status: "Processed" });

    // Lấy thông tin người dùng để gửi email
    const user = await db("users")
      .where({ id: borrowRequest.user_id })
      .select("email", "name")
      .first();
    if (!user) throw new Error("Không tìm thấy người dùng");

    const htmlContent = await ejs.renderFile(
      path.join(__dirname, "../../templates/borrowStatus.ejs"),
      { name: user.name }
    );

    await fastify.mailer.sendMail({
      from: "truong9x00z@gmail.com",
      to: user.email,
      subject: "Cập nhật trạng thái yêu cầu mượn sách",
      text: `Xin chào ${user.name},\n\nYêu cầu mượn sách của bạn đã được xử lý xong. Vui lòng kiểm tra danh sách sách đã được duyệt.\n\nCảm ơn!`,
      html: htmlContent,
    });

    console.log("Đã gửi mail");

    return reply.send({
      message: `Đơn hàng ${orderId} đã được cập nhật thành ${status}`,
    });
  });
}
