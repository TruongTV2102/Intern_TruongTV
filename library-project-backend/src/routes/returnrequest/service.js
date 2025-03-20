import db from "../../db.js";

export const getReturnRequests = async () => {
  return db("borrow_history")
    .select(
      "borrow_history.id",
      "borrow_history.user_id",
      "borrow_history.book_id",
      "borrow_history.borrow_date",
      "borrow_history.return_date",
      "borrow_history.status",
      "users.name as user_name",
      "users.email as user_email",
      "books.name as book_name",
      "books.author as book_author"
    )
    .join("users", "borrow_history.user_id", "users.id")
    .join("books", "borrow_history.book_id", "books.id")
    .where("borrow_history.status", "borrowed");
};

export const confirmReturn = async (id) => {
  const borrowRecord = await db("borrow_history").where({ id }).first();
  if (!borrowRecord) {
    throw new Error("Không tìm thấy bản ghi");
  }

  const now = new Date();
  const returnDate = new Date(borrowRecord.return_date);
  let overdueFine = 0;

  if (now > returnDate) {
    const diffMs = now - returnDate;
    const overdueHours = Math.ceil(diffMs / (1000 * 60 * 60));
    overdueFine = overdueHours * 500;
  }

  await db("borrow_history").where({ id }).update({
    status: "returned",
    overdue_fine: overdueFine,
  });

  return { message: "Xác nhận trả sách thành công", overdueFine };
};
