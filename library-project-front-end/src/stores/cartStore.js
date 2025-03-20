import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from 'src/api'
import { useAuthStore } from 'src/stores/auth'

const STORAGE_KEY = 'cartList'

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
  const authStore = useAuthStore()

  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value))
  }

  const addBook = (book) => {
    if (!cart.value.some((b) => b.id === book.id)) {
      cart.value.push({ ...book })
      saveToLocalStorage()
    }
  }

  const removeBook = (bookId) => {
    cart.value = cart.value.filter((b) => b.id !== bookId)
    saveToLocalStorage()
  }

  const clearCart = () => {
    cart.value = []
    saveToLocalStorage()
  }

  // Gửi yêu cầu mượn sách
  const borrowBooks = async () => {
    if (!authStore.user) {
      alert('Bạn cần đăng nhập để mượn sách!')
      return
    }

    if (cart.value.length === 0) {
      alert('Giỏ hàng đang trống!')
      return
    }

    try {
      const bookIds = cart.value.map((book) => book.id)

      const requestData = {
        user_id: authStore.user.id,
        books: bookIds,
      }

      await api.post('/borrow', requestData)
      alert('Gửi yêu cầu mượn sách thành công!')

      clearCart() // Xóa giỏ hàng sau khi mượn thành công
    } catch (error) {
      console.error(error)
      alert('Không thể gửi yêu cầu mượn sách!')
    }
  }

  return { cart, addBook, removeBook, clearCart, borrowBooks }
})
