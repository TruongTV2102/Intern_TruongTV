import db from "../../config/db.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";

export default async function returnRoutes(fastify) {
  // Trả sách
  fastify.put(
    "/return-book/:borrow_item_id",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { borrow_item_id } = req.params;

      await db.transaction(async (trx) => {
        // Lấy thông tin mượn sách
        const borrowItem = await trx("borrow_items")
          .where("id", borrow_item_id)
          .first();

        if (!borrowItem || borrowItem.status !== "Approved") {
          throw new Error("Sách không hợp lệ hoặc đã được trả.");
        }

        // Tính phí trễ hạn
        const now = new Date();
        const dueDate = new Date(borrowItem.due_date);
        console.log(dueDate);

        const daysLate = Math.max(
          0,
          Math.ceil((now - dueDate) / (1000 * 60 * 60))
        );
        const lateFee = daysLate * 500;

        // Cập nhật trạng thái sách
        await trx("borrow_items").where("id", borrow_item_id).update({
          status: "Returned",
          return_date: now,
        });

        // Tăng số lượng sách trong kho
        await trx("books")
          .where("id", borrowItem.book_id)
          .increment("quantity", 1);

        return reply.send({
          message: "Sách đã được trả.",
          late_fee: lateFee,
          time: daysLate,
        });
      });
    }
  );

  // Mất sách
  fastify.put(
    "/mark-lost/:borrow_item_id",
    {
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { borrow_item_id } = req.params;

      await db.transaction(async (trx) => {
        // Lấy thông tin sách
        const borrowItem = await trx("borrow_items")
          .where("id", borrow_item_id)
          .first();

        if (!borrowItem || borrowItem.status !== "Approved") {
          throw new Error("Sách không hợp lệ hoặc đã được trả.");
        }

        // Cập nhật trạng thái thành "Lost"
        await trx("borrow_items")
          .where("id", borrow_item_id)
          .update({ status: "Lost" });

        return reply.send({
          message: "Đã cập nhật trạng thái sách thành 'Lost'.",
        });
      });
    }
  );
}
