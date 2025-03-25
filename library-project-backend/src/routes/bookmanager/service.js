import db from "../../config/db.js";

// Kiểm tra genre, nếu chưa có thì thêm vào
async function getOrCreateGenre(genre) {
  let [genreRecord] = await db("genres").where("name", genre).select("id");
  if (!genreRecord) {
    const [genreId] = await db("genres").insert({ name: genre });
    return { id: genreId };
  }
  return genreRecord;
}

// Thêm sách vào database
export async function addBook(bookData) {
  const {
    title,
    author,
    genre,
    published_year,
    quantity,
    total_quantity,
    cover_image_url,
    description,
  } = bookData;

  const genreRecord = await getOrCreateGenre(genre);

  const [bookId] = await db("books").insert({
    title,
    author,
    genre_id: genreRecord.id,
    published_year,
    quantity,
    total_quantity,
    cover_image_url,
    description,
  });

  return bookId;
}

// Lấy danh sách sách

export async function getBooks({
  title,
  genre,
  author,
  published_year,
  page = 1,
  limit = 8,
}) {
  const offset = (page - 1) * limit;

  // Truy vấn danh sách sách
  const booksQuery = db("books")
    .leftJoin("genres", "books.genre_id", "genres.id")
    .select(
      "books.id",
      "books.title",
      "books.author",
      "books.published_year",
      "books.quantity",
      "books.total_quantity",
      "books.cover_image_url",
      "books.description",
      "genres.name as genre"
    )
    .limit(limit)
    .offset(offset);

  // Thêm điều kiện lọc nếu có
  if (genre) booksQuery.whereILike("genres.name", genre);
  if (author) booksQuery.whereILike("books.author", `%${author}%`);
  if (title) booksQuery.whereILike("books.title", `%${title}%`);
  if (published_year) booksQuery.where("books.published_year", published_year);

  const books = await booksQuery;

  // Đếm tổng số sách
  const [{ total }] = await db("books")
    .leftJoin("genres", "books.genre_id", "genres.id")
    .modify((query) => {
      if (genre) query.whereILike("genres.name", genre);
      if (author) query.whereILike("books.author", `%${author}%`);
      if (title) query.whereILike("books.title", `%${title}%`);
      if (published_year) query.where("books.published_year", published_year);
    })
    .count("books.id as total");

  return { books, total };
}

export async function getBookById(id) {
  try {
    const book = await db("books")
      .leftJoin("genres", "books.genre_id", "genres.id")
      .select(
        "books.title",
        "books.author",
        "books.published_year",
        "books.quantity",
        "books.total_quantity",
        "books.cover_image_url",
        "books.description",
        "genres.name as genre"
      )
      .where("books.id", id)
      .first();
    return book || null;
  } catch (error) {
    console.error("Lỗi lấy sách theo ID:", error);
    throw new Error("Lỗi khi truy vấn database");
  }
}

// Cập nhật thông tin sách

export async function updateBook(bookId, bookData) {
  const {
    title,
    author,
    genre,
    published_year,
    quantity,
    total_quantity,
    cover_image_url,
    description,
  } = bookData;
  console.log(bookId);

  const genreRecord = await getOrCreateGenre(genre);

  return await db("books").where("books.id", bookId).update({
    title,
    author,
    genre_id: genreRecord.id,
    published_year,
    quantity,
    total_quantity,
    cover_image_url,
    description,
  });
}

// Xóa sách theo ID

export async function deleteBook(bookId) {
  const deletedRows = await db("books").where("id", bookId).del();
  if (!deletedRows) throw new Error("Sách không tồn tại");
  return deletedRows;
}

export async function updateBorrowStatus(
  id,
  status,
  fine = 0,
  return_date = null
) {
  const book = await db("borrow_items").where("id", id).first();
  if (!book) throw new Error("Không tìm thấy bản ghi");

  const updates = { status };
  if (return_date) updates.return_date = return_date;
  if (fine) updates.fine = fine;

  // // Nếu trạng thái là Approved, cập nhật due_date (thêm 1 tháng từ ngày hiện tại)
  // if (status === "Approved") {
  // }
  // if (status === "Return") {
  //   const returnDate = new Date();
  //   updateData.return_date = returnDate;
  // }

  await db("borrow_items").where("id", id).update(updates);

  // Cập nhật số lượng sách
  if (status === "Approved") {
    await db("books").where("id", book.book_id).decrement("quantity", 1);
    updates.due_date = new Date();
    updates.due_date.setMonth(updates.due_date.getMonth() + 1);
  } else if (status === "Returned") {
    await db("books").where("id", book.book_id).increment("quantity", 1);
    updates.return_date = new Date(); // Cập nhật ngày trả khi trả sách
  }

  return await db("borrow_items").where({ id }).update(updates);
}
