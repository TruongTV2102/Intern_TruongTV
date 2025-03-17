import db from "../../db.js";

/**
 * Kiểm tra author, nếu chưa có thì thêm vào
 */
async function getOrCreateAuthor(author) {
  let [authorRecord] = await db("authors").where("name", author).select("id");
  if (!authorRecord) {
    const [authorId] = await db("authors").insert({ name: author });
    return { id: authorId };
  }
  return authorRecord;
}

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
  const { title, author, genre, published_year, quantity, cover_image_id } =
    bookData;

  const authorRecord = await getOrCreateAuthor(author);
  const genreRecord = await getOrCreateGenre(genre);

  const [bookId] = await db("books").insert({
    title,
    author_id: authorRecord.id,
    genre_id: genreRecord.id,
    published_year,
    quantity,
    total_quantity: quantity,
    cover_image_id,
  });

  return bookId;
}

/**
 * Lấy danh sách sách
 */
export async function getBooks() {
  return await db("books")
    .leftJoin("images", "books.cover_image_id", "images.id")
    .leftJoin("authors", "books.author_id", "authors.id")
    .leftJoin("genres", "books.genre_id", "genres.id")
    .select(
      "books.id",
      "books.title",
      "authors.name as author",
      "genres.name as genre",
      "books.published_year",
      "books.quantity",
      "books.total_quantity",
      "images.url as cover_image_url"
    );
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
  const { title, author, genre, published_year, quantity, cover_image_id } =
    bookData;

  const authorRecord = await getOrCreateAuthor(author);
  const genreRecord = await getOrCreateGenre(genre);

  await db("books").where("id", bookId).update({
    title,
    author_id: authorRecord.id,
    genre_id: genreRecord.id,
    published_year,
    quantity,
    cover_image_id,
  });
}

/**
 * Xóa sách theo ID
 */
export async function deleteBook(bookId) {
  await db("books").where("id", bookId).del();
}
