<template>
  <q-page class="tw-p-6">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Thông tin người dùng</h1>

    <q-card v-if="user" class="tw-p-4 tw-shadow-md tw-rounded-lg">
      <div class="tw-flex tw-items-center tw-space-x-4">
        <q-avatar size="100px">
          <img :src="previewUrl || userData.avatar" alt="Avatar" />
        </q-avatar>

        <q-btn
          label="Cập nhật ảnh đại diện"
          icon="upload"
          color="primary"
          @click="triggerFileInput"
        />

        <q-file
          ref="fileInput"
          v-model="selectedFile"
          accept="image/*"
          class="hidden"
          @update:model-value="handleFileChange"
        />
      </div>

      <q-list class="tw-mt-4">
        <q-item>
          <q-item-section>
            <strong>Tên:</strong>
            <q-input v-model="userData.name" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section> <strong>Email:</strong> {{ userData.email }} </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <strong>Số điện thoại:</strong>
            <q-input v-model="userData.phone" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <strong>Ngày sinh:</strong>
            <q-input v-model="userData.birthday" type="date" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section> <strong>Vai trò:</strong> {{ user.role }} </q-item-section>
        </q-item>
      </q-list>

      <q-btn @click="updateProfile" color="primary" class="tw-mt-4">Lưu thay đổi</q-btn>
    </q-card>
    <div v-else class="tw-text-gray-600 tw-text-sm">Không tìm thấy thông tin người dùng.</div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/api'
import { toast } from 'src/plugins/toast'
import { useAuthStore } from 'src/stores/auth'
import { formatDate } from 'src/utils/dateUtils'
import { useUploadImage } from 'src/utils/cloudinaryUpload'

const authStore = useAuthStore()
const user = ref({})
const userData = ref({ name: '', phone: '', birthday: '', avatar: '' })
const isLoading = ref(false)
const fileInput = ref(null)
const { selectedFile, previewUrl, handleFileChange, uploadImage } = useUploadImage()

const fetchUser = async () => {
  try {
    const res = await api.get(`/users/${authStore.user.id}`)
    user.value = res.data

    userData.value = {
      avatar: res.data.avatar,
      name: res.data.name,
      email: res.data.email,
      phone: res.data.phone,
      birthday: formatDate(res.data.birthday, 'YYYY-MM-DD'),
    }
  } catch (error) {
    console.error('❌ Lỗi khi tải thông tin:', error)
    toast.error('Không thể tải thông tin người dùng!')
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.pickFiles() // Dùng pickFiles() thay vì .click()
  }
}

const updateProfile = async () => {
  isLoading.value = true
  let uploadedImageUrl = userData.value.avatar

  try {
    if (selectedFile.value) {
      uploadedImageUrl = await uploadImage()
    }

    await api.put(`/users/${authStore.user.id}`, {
      name: userData.value.name.trim(),
      phone: userData.value.phone.trim(),
      birthday: formatDate(userData.value.birthday, 'YYYY-MM-DD'),
      avatar: uploadedImageUrl,
    })

    toast.info('Cập nhật thành công!')
    fetchUser()
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật thông tin:', error)
    toast.error('Không thể cập nhật thông tin!')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchUser)
</script>
