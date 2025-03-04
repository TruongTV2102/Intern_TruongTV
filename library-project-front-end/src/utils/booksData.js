import { ref } from 'vue'
import { faker } from '@faker-js/faker'

const books = ref([])

for (let i = 0; i < 100; i++) {
  const quantity = faker.number.int({ min: 0, max: 50 })
  const totalQuantity = faker.number.int({ min: quantity, max: 100 })

  books.value.push({
    id: faker.string.numeric(5), // Tạo ID có 5 chữ số
    name: faker.book.title(), // Tiêu đề sách
    author: faker.book.author(), // Tên tác giả
    genre: faker.book.genre(), // Thể loại (thay vì faker.book.genre() do bản mới không có)
    bookcode: faker.commerce.isbn(),
    year: faker.number.int({ min: 1700, max: 2024 }),
    quantity,
    totalQuantity,
    description: faker.lorem.sentence(20), // Mô tả sách
    image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }), // Ảnh sách
  })
}

export { books }
