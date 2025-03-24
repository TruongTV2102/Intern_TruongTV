import db from "../../config/db.js";
import { BorrowStatus } from "../../constants/enum.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";
import { approveBorrowSchema, borrowRequestSchema } from "./schema.js";

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
      const { status } = req.body;

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
            await fastify.mailer.sendMail({
              from: "truong9x00z@gmail.com",
              to: user.email,
              subject: "Cập nhật trạng thái yêu cầu mượn sách",
              text: `Xin chào ${user.name},\n\nYêu cầu mượn sách của bạn đã được xử lý xong. Vui lòng kiểm tra danh sách sách đã được duyệt.\n\nCảm ơn!`,
            });
          }
        }
      }

      return reply.send({ message: `Đã cập nhật trạng thái sách: ${status}.` });
    }
  );
}
