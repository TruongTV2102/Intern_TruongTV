import db from "../../config/db.js";

export default async function bookSearchRoutes(fastify) {
  fastify.get("/books/search", async (req, reply) => {
    const { title, genre, author, published_year } = req.query;

    // Khởi tạo truy vấn JOIN để lấy đầy đủ thông tin
    const sql = db("books")
      .leftJoin("genres", "books.genre_id", "genres.id")
      .select(
        "books.*",
        "authors.name as author_name",
        "genres.name as genre_name"
      );

    // Nếu có genre, kiểm tra và lọc theo tên
    if (genre) {
      sql.whereILike("genres.name", `%${genre}%`);
    }

    // Nếu có author, kiểm tra và lọc theo tên
    if (author) {
      sql.whereILike("author", `%${author}%`);
    }

    // Nếu có title, tìm kiếm theo tiêu đề sách
    if (title) {
      sql.whereILike("books.title", `%${title}%`);
    }

    // Nếu có năm xuất bản, lọc theo năm xuất bản
    if (published_year) {
      sql.whereILike("books.published_year", `%${published_year}%`);
    }

    return sql;
  });
}
