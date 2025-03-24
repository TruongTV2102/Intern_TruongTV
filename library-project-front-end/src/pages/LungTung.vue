<script setup>
import { ref } from 'vue'
import axios from 'axios'

const bookTitle = ref('')
const bookAuthor = ref('')
const bookGenre = ref('')
const bookYear = ref('')
const bookQuantity = ref(1)
const selectedImage = ref(null)
const previewUrl = ref('')
const isLoading = ref(false)

const token = localStorage.getItem('token') // 📌 Lấy token từ localStorage

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (!token) {
    alert('Bạn chưa đăng nhập!')
    return
  }

  let uploadedImageUrl = null
  isLoading.value = true

  try {
    // 1️⃣ **Upload ảnh**
    if (selectedImage.value) {
      const formData = new FormData()
      formData.append('file', selectedImage.value)

      const { data: uploadData } = await axios.post(
        'http://localhost:3000/upload-image',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      uploadedImageUrl = uploadData.url // 📌 Lấy URL ảnh
    }

    // 2️⃣ **Thêm sách vào database**
    const bookData = {
      title: bookTitle.value.trim(),
      author: bookAuthor.value.trim(),
      genre: bookGenre.value.trim(),
      published_year: bookYear.value,
      quantity: bookQuantity.value,
      total_quantity: bookQuantity.value,
      cover_image_url: uploadedImageUrl, // 📌 Lưu trực tiếp URL vào `books`
    }
    console.log(bookData)

    await axios.post('http://localhost:3000/books', bookData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    alert('Thêm sách thành công!')
  } catch (error) {
    console.error('Lỗi khi thêm sách:', error)
    alert(error.response?.data?.error || 'Có lỗi xảy ra!')

    // 🛑 Nếu thêm sách thất bại, xóa ảnh đã upload
    if (uploadedImageUrl) {
      const cloudinaryPublicId = uploadedImageUrl.split('/').pop().split('.')[0] // Lấy public_id của Cloudinary
      await axios
        .delete(`http://localhost:3000/delete-image/${cloudinaryPublicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((err) => console.error('Lỗi khi xóa ảnh:', err))
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Thêm Sách Mới</h2>

    <div class="mb-4">
      <label class="block font-semibold">Tiêu đề</label>
      <input v-model.trim="bookTitle" type="text" class="w-full border p-2 rounded" />
    </div>

    <div class="mb-4">
      <label class="block font-semibold">Tác giả</label>
      <input v-model.trim="bookAuthor" type="text" class="w-full border p-2 rounded" />
    </div>

    <div class="mb-4">
      <label class="block font-semibold">Thể loại</label>
      <input v-model.trim="bookGenre" type="text" class="w-full border p-2 rounded" />
    </div>

    <div class="mb-4">
      <label class="block font-semibold">Năm xuất bản</label>
      <input v-model="bookYear" type="number" class="w-full border p-2 rounded" />
    </div>

    <div class="mb-4">
      <label class="block font-semibold">Số lượng</label>
      <input v-model="bookQuantity" type="number" min="1" class="w-full border p-2 rounded" />
    </div>

    <div class="mb-4">
      <label class="block font-semibold">Ảnh bìa</label>
      <input type="file" @change="handleFileChange" class="w-full border p-2 rounded" />
      <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="mt-2 w-40 rounded-lg shadow" />
    </div>

    <button
      @click="handleSubmit"
      :disabled="isLoading"
      class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
    >
      {{ isLoading ? 'Đang xử lý...' : 'Thêm sách' }}
    </button>
  </div>
</template>
