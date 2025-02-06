<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8 tw-ml-[300px]"
  >
    <div class="tw-w-full tw-max-w-[500px] tw-px-4 tw-py-6 tw-bg-white tw-rounded-lg tw-shadow-lg">
      <header class="tw-h-[130px] tw-flex tw-items-center tw-justify-center">
        <div class="model-header tw-text-[30px] tw-font-semibold">Forgot Password</div>
      </header>

      <div class="q-gutter-y-md column tw-space-y-4">
        <q-input
          clearable
          filled
          v-model="formData.email"
          label="Email"
          class="tw-px-4 tw-py-2"
          @submit.prevent="onSubmit"
          :error="!!validationErrors.email"
          :error-message="validationErrors.email"
        />
        <div class="tw-flex tw-items-center tw-justify-center tw-mb-4">
          <q-btn
            type="submit"
            color="primary"
            label="Send the new password via email"
            class="tw-px-6 tw-py-2 tw-rounded-md tw-w-[95%]"
            @click="onSubmit"
          />
        </div>
        <p v-if="message" class="tw-text-center tw-text-green-600">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { validateData } from 'src/components/validator.js'
import { getLoginList } from 'src/utils/loginData'

const formData = reactive({
  email: '',
})

const validationErrors = ref({})
const message = ref('')

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 1,
      errorMessage: {
        type: 'Email phải là một chuỗi.',
        format: 'Email không hợp lệ.',
        minLength: 'Email không được để trống.',
      },
    },
  },
}

// Hàm tạo mật khẩu ngẫu nhiên
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8) // Lấy 8 ký tự ngẫu nhiên
}

// Hàm xử lý khi submit form
const onSubmit = () => {
  const { errors, isValid } = validateData(formData, schema)
  validationErrors.value = errors || {}

  if (isValid) {
    const users = getLoginList()
    const user = users.find((u) => u.email === formData.email)

    if (user) {
      // Tạo mật khẩu mới và cập nhật
      const newPassword = generateRandomPassword()
      user.password = newPassword

      // Cập nhật danh sách người dùng
      localStorage.setItem('loginList', JSON.stringify(users))

      // Giả lập gửi email (ở đây chỉ console.log)
      console.log(`Gửi email đến ${user.email}: Mật khẩu mới của bạn là ${newPassword}`)

      message.value = `Mật khẩu mới đã được gửi đến email: ${user.email}`
    } else {
      message.value = 'Email không tồn tại trong hệ thống.'
    }
  }
}
</script>
