import fs from "fs/promises";
import path from "path";

const booksFile = path.join(process.cwd(), "books.json");

// 📌 Đọc danh sách sách
export const loadBooks = async () => {
  try {
    const data = await fs.readFile(booksFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Lưu danh sách sách
export const saveBooks = async (books) => {
  await fs.writeFile(booksFile, JSON.stringify(books, null, 2));
};

// Thêm sách mới
export const addBook = async ({
  name,
  bookcode,
  author,
  genre,
  year,
  quantity,
  totalQuantity,
}) => {
  const books = await loadBooks();
  const newBook = {
    id: Date.now().toString(),
    name,
    bookcode,
    author,
    genre,
    year,
    quantity,
    totalQuantity,
  };
  books.push(newBook);
  await saveBooks(books);
  return newBook;
};

// Lấy danh sách sách
export const getBooks = async () => {
  return await loadBooks();
};

// Cập nhật sách
export const updateBook = async (
  id,
  { name, bookcode, author, genre, year, quantity, totalQuantity }
) => {
  let books = await loadBooks();
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;

  books[index] = {
    id,
    name,
    bookcode,
    author,
    genre,
    year,
    quantity,
    totalQuantity,
  };
  await saveBooks(books);
  return books[index];
};

// Xóa sách
export const deleteBook = async (id) => {
  let books = await loadBooks();
  const newBooks = books.filter((book) => book.id !== id);
  if (books.length === newBooks.length) return false;

  await saveBooks(newBooks);
  return true;
};
