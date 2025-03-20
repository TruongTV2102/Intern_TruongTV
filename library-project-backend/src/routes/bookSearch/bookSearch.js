import db from "../../config/db.js";

export default async function bookSearchRoutes(fastify) {
  fastify.get("/books/search", async (req, reply) => {
    const {
      title,
      genre,
      author,
      published_year,
      page = 1,
      limit = 8,
    } = req.query;

    const offset = (page - 1) * limit; // Tính toán offset cho phân trang

    // Truy vấn dữ liệu sách với các bộ lọc
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
  });
}
