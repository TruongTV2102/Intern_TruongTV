import db from "../../config/db.js";
import { authenticate, authorizeAdmin } from "../login/auth.js";
import { returnLostSchema } from "./schema.js";
import { BorrowStatus } from "../../constants/enum.js";

export default async function returnRoutes(fastify) {
  fastify.put(
    "/return_or_lost/:borrow_item_id",
    {
      schema: returnLostSchema, // Định nghĩa schema nếu cần
      preValidation: [authenticate, authorizeAdmin],
    },
    async (req, reply) => {
      const { borrow_item_id } = req.params;
      const { status, fine } = req.body;

      if (![BorrowStatus.RETURNED, BorrowStatus.LOST].includes(status)) {
        return reply.status(400).send({ message: "Trạng thái không hợp lệ." });
      }

      await db.transaction(async (trx) => {
        const borrowItem = await trx("borrow_items")
          .where("id", borrow_item_id)
          .first();

        if (!borrowItem) {
          throw new Error("Không tìm thấy sách trong yêu cầu mượn.");
        }

        if (borrowItem.status !== BorrowStatus.APPROVED) {
          throw new Error("Chỉ có thể cập nhật sách đang được mượn.");
        }

        const return_date = new Date();
        await trx("borrow_items")
          .where("id", borrow_item_id)
          .update({
            status,
            fine: fine || 0,
            return_date,
          });
      });

      return reply.send({
        message: `Đã cập nhật trạng thái sách: ${status}.`,
      });
    }
  );
}
