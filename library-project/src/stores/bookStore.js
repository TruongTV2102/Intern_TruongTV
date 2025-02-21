import { defineStore } from 'pinia'
import { ref } from 'vue'
import { faker } from '@faker-js/faker'

const STORAGE_KEY = 'bookList'

export const useBookStore = defineStore('bookStore', () => {
  const books = ref(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])

  // Nếu chưa có dữ liệu, tạo mới
  if (books.value.length === 0) {
    for (let i = 0; i < 100; i++) {
      const quantity = faker.number.int({ min: 0, max: 50 })
      const totalQuantity = faker.number.int({ min: quantity, max: 100 })

      books.value.push({
        id: faker.database.mongodbObjectId(),
        name: faker.book.title(),
        author: faker.book.author(),
        genre: faker.book.genre(),
        bookcode: faker.commerce.isbn(),
        year: faker.number.int({ min: 1700, max: 2024 }),
        quantity,
        totalQuantity,
        description: faker.lorem.sentence(20),
        image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
      })
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
  }

  // Thêm sách mới
  const createBook = (book) => {
    books.value.push(book)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
  }

  // Cập nhật thông tin sách
  const updateBook = (bookId, newData) => {
    const index = books.value.findIndex((b) => b.id === bookId)
    if (index !== -1) {
      books.value[index] = { ...books.value[index], ...newData }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
    }
  }

  // Xóa sách
  const deleteBook = (bookId) => {
    books.value = books.value.filter((b) => b.id !== bookId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
  }

  return { books, createBook, updateBook, deleteBook }
})
