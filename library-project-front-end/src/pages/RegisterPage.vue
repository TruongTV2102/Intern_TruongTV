<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8 tw-ml-[300px]"
  >
    <div class="tw-w-full tw-max-w-[500px] tw-px-4 tw-py-6 tw-bg-white tw-rounded-lg tw-shadow-lg">
      <header class="tw-h-[130px] tw-flex tw-items-center tw-justify-center">
        <div class="model-header tw-text-[30px] tw-font-semibold">Register</div>
      </header>

      <div class="q-gutter-y-md column tw-space-y-4">
        <q-form @submit.prevent="onSubmit" ref="formRef">
          <!-- Form bắt sự kiện submit -->
          <!-- Name -->
          <q-input
            ref="nameInput"
            clearable
            filled
            v-model="formData.name"
            label="Name"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.name"
            :error-message="validationErrors.name"
          />

          <!-- Date -->
          <q-input
            ref="dateInput"
            filled
            v-model="formData.date"
            label="Date of Birth"
            class="tw-px-4 tw-py-3"
            type="date"
            :error="!!validationErrors.date"
            :error-message="validationErrors.date"
          />

          <!-- Phone Number -->
          <q-input
            ref="phoneInput"
            clearable
            filled
            v-model="formData.phone"
            label="Phone Number"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.phone"
            :error-message="validationErrors.phone"
          />

          <!-- Email -->
          <q-input
            ref="emailInput"
            clearable
            filled
            v-model="formData.email"
            label="Email"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.email"
            :error-message="validationErrors.email"
          />

          <!-- Password -->
          <q-input
            ref="passwordInput"
            v-model="formData.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.password"
            :error-message="validationErrors.password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- Confirm Password -->
          <q-input
            ref="confirmPasswordInput"
            v-model="formData.confirmpassword"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Confirm Password"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.confirmpassword"
            :error-message="validationErrors.confirmpassword"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="tw-flex tw-items-center tw-justify-center tw-mb-4 tw-px-4 tw-py-3">
            <q-btn
              type="submit"
              color="primary"
              label="Register"
              class="tw-px-6 tw-py-3 tw-rounded-md tw-w-[95%]"
            />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { validateData } from 'src/schema/validator.js'
import { toast } from 'src/plugins/toast'
import { useRouter } from 'vue-router'
import { registerSchema } from 'src/schema/register/validationSchema.js'
import axios from 'axios'

// Cấu trúc dữ liệu cho form
const isPwd = ref(true)
const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
  date: '',
  phone: '',
})

const validationErrors = ref({})

// Hàm xử lý khi submit form
const onSubmit = async () => {
  const { errors, isValid } = validateData(formData, registerSchema)
  validationErrors.value = errors

  if (!isValid) return

  try {
    await axios.post('http://127.0.0.1:3000/register', formData)

    toast.info('Đăng ký thành công')
    router.push('/login')
  } catch (error) {
    console.error('Lỗi đăng ký:', error) // Log lỗi chi tiết

    if (error.response) {
      console.error('Phản hồi từ server:', error.response.data) // Log phản hồi từ server
      validationErrors.value = error.response.data
      toast.error(error.response.data.error || 'Đăng ký thất bại')
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ server:', error.request)
      toast.error('Không kết nối được đến server')
    } else {
      console.error('Lỗi không xác định:', error.message)
      toast.error('Lỗi không xác định')
    }
  }
}
</script>
