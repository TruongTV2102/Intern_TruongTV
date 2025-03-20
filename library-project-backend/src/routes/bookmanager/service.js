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
export async function getBooks(page = 1, limit = 5) {
  const offset = (page - 1) * limit;

  const books = await db("books")
    .leftJoin("genres", "books.genre_id", "genres.id")
    .select(
      "books.id",
      "books.title",
      "author",
      "genres.name as genre",
      "books.published_year",
      "books.quantity",
      "books.total_quantity",
      "cover_image_url"
    )
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db("books").count("id as total");

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
