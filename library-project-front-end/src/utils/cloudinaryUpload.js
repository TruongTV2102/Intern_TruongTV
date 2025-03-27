import { ref } from 'vue'

export function useUploadImage() {
  const selectedFile = ref(null)
  const previewUrl = ref('')
  const uploadedUrl = ref('')

  // Xem trước ảnh khi chọn file dùng q-file( nếu dùng input file thì const handleFileChange = (event) => {const file = event.target.files[0] // Lấy file đầu tiên)

  const handleFileChange = (file) => {
    console.log(file)

    if (!file) {
      console.error('Không có file nào được chọn!')
      return
    }

    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file) // Tạo URL xem trước ảnh
    console.log(previewUrl)
  }

  // Upload lên Cloudinary khi ấn "Lưu"
  const uploadImage = async () => {
    if (!selectedFile.value) return null

    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('upload_preset', 'ml_default')

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dp39ryiip/image/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      uploadedUrl.value = data.secure_url // Lưu URL thực tế từ Cloudinary
      return uploadedUrl.value
    } catch (error) {
      console.error('Upload failed:', error)
      return null
    }
  }

  return { selectedFile, previewUrl, handleFileChange, uploadImage, uploadedUrl }
}
