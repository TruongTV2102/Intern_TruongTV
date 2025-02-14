// stores/bookStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { faker } from '@faker-js/faker'

export const useBookStore = defineStore('bookStore', () => {
  const books = ref([])

  // Generate books data with Faker
  for (let i = 0; i < 100; i++) {
    const quantity = faker.number.int({ min: 0, max: 50 })
    const totalQuantity = faker.number.int({ min: quantity, max: 100 })

    books.value.push({
      id: faker.string.numeric(5),
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

  return { books }
})
