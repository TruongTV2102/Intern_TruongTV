import db from "../../config/db.js";

/**
 * Kiểm tra genre, nếu chưa có thì thêm vào
 */
async function getOrCreateGenre(genre) {
  let [genreRecord] = await db("genres").where("name", genre).select("id");
  if (!genreRecord) {
    const [genreId] = await db("genres").insert({ name: genre });
    return { id: genreId };
  }
  return genreRecord;
}

/**
 * Thêm sách vào database
 */
export async function addBook(bookData) {
  const { title, author, genre, published_year, quantity, cover_image_url } =
    bookData;

  const genreRecord = await getOrCreateGenre(genre);

  const [bookId] = await db("books").insert({
    title,
    author,
    genre_id: genreRecord.id,
    published_year,
    quantity,
    total_quantity: quantity,
    cover_image_url,
  });

  return bookId;
}

/**
 * Lấy danh sách sách
 */
export async function getBooks({
  title,
  genre,
  author,
  published_year,
  page = 1,
  limit = 8,
}) {
  const offset = (page - 1) * limit;

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
      "genres.name as genre_name"
    )
    .limit(limit)
    .offset(offset);
  console.log(booksQuery);

  // Thêm điều kiện lọc nếu có
  if (genre) {
    booksQuery.whereILike("genres.name", genre);
  }
  if (author) {
    booksQuery.whereILike("books.author", `%${author}%`);
  }
  if (title) {
    booksQuery.whereILike("books.title", `%${title}%`);
  }
  if (published_year) {
    booksQuery.where("books.published_year", published_year);
  }

  // Lấy danh sách sách
  const books = await booksQuery;

  // Đếm tổng số sách phù hợp với bộ lọc
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
    const book = await db("books").where({ id }).first();
    return book || null;
  } catch (error) {
    console.error("Lỗi lấy sách theo ID:", error);
    throw new Error("Lỗi khi truy vấn database");
  }
}

/**
 * Cập nhật thông tin sách
 */
export async function updateBook(bookId, bookData) {
  const { title, author, genre, published_year, quantity, cover_image_url } =
    bookData;
  const genreRecord = await getOrCreateGenre(genre);

  await db("books").where("id", bookId).update({
    title,
    author,
    genre_id: genreRecord.id,
    published_year,
    quantity,
    cover_image_url,
  });
}

/**
 * Xóa sách theo ID
 */
export async function deleteBook(bookId) {
  const deletedRows = await db("books").where("id", bookId).del();
  if (!deletedRows) throw new Error("Sách không tồn tại");
  return deletedRows;
}
