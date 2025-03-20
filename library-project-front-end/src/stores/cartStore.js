import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from 'src/api'
import { toast } from 'src/plugins/toast'
import { useAuthStore } from 'src/stores/auth'

const STORAGE_KEY = 'cartList'

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
  const authStore = useAuthStore()

  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value))
  }

  const addBook = async (book) => {
    if (!authStore.user) {
      toast.error('Bạn cần đăng nhập để mượn sách!')
      return
    }

    try {
      console.log('📌 Gọi API kiểm tra lịch sử mượn sách...')

      const { data } = await api.get(`/history/user/${authStore.user.id}`)
      console.log('📌 Dữ liệu trả về từ API:', data)

      const existingBook = data.find((item) => item.book_id === book.id)

      if (existingBook) {
        if (existingBook.status === 'Pending') {
          toast.warning('Sách đang trong danh sách chờ duyệt!')
          return
        }
        if (existingBook.status === 'Approved') {
          toast.error('Sách này đang được bạn mượn, không thể thêm vào giỏ hàng!')
          return
        }
      }

      if (!cart.value.some((b) => b.id === book.id)) {
        cart.value.push(book)
        toast.info('Đã thêm vào giỏ hàng!')
        saveToLocalStorage()
      } else {
        toast.warning('Sách đã có trong giỏ hàng!')
      }
    } catch (error) {
      console.error('❌ Lỗi khi kiểm tra lịch sử mượn sách:', error)
      toast.error('Không thể kiểm tra lịch sử mượn sách!')
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
      toast.warning('Bạn cần đăng nhập để mượn sách!')
      return
    }

    if (cart.value.length === 0) {
      toast.warning('Giỏ hàng đang trống!')
      return
    }

    try {
      const bookIds = cart.value.map((book) => book.id)

      const requestData = {
        user_id: authStore.user.id,
        books: bookIds,
      }

      await api.post('/borrow', requestData)
      toast.info('Gửi yêu cầu mượn sách thành công!')

      clearCart() // Xóa giỏ hàng sau khi mượn thành công
    } catch (error) {
      console.error(error)
      toast.error('Không thể gửi yêu cầu mượn sách!')
    }
  }

  return { cart, addBook, removeBook, clearCart, borrowBooks }
})
