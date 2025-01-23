<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8"
  >
    <div class="tw-w-full tw-max-w-[500px] tw-px-4 tw-py-6 tw-bg-white tw-rounded-lg tw-shadow-lg">
      <header class="tw-h-[130px] tw-flex tw-items-center tw-justify-center">
        <div class="model-header tw-text-[30px] tw-font-semibold">Login</div>
      </header>

      <q-form @submit="onSubmit" ref="formRef">
        <div class="q-gutter-y-md column tw-space-y-4">
          <!-- Email -->
          <q-input
            ref="emailInput"
            filled
            v-model="formData.email"
            label="Email"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.email && a"
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
            :error="!!validationErrors.password && a"
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
        </div>

        <!-- Options -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <q-checkbox right-label v-model="rememberMe" label="Remember me" class="tw-text-sm" />
          <q-btn
            type="submit"
            color="primary"
            label="LOGIN"
            class="tw-px-6 tw-py-3 tw-rounded-md"
          />
        </div>
      </q-form>

      <div class="tw-text-center tw-text-sm">
        <a
          href="http://localhost:9000/#/register"
          class="tw-mr-4 tw-text-blue-600 hover:tw-underline"
          >Register now</a
        >
        <a href="http://localhost:9000/#/forgotpassword" class="tw-text-blue-600 hover:tw-underline"
          >Forgot password?</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { validateData } from 'src/components/Validator.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const isPwd = ref(true)
const rememberMe = ref(false)

// Biến reactive để chứa form và lỗi
const formData = reactive({
  email: '',
  password: '',
})

const validationErrors = ref({})

// Danh sách tài khoản hợp lệ
const loginList = [
  { email: 'truongtv@gmail.com', password: '1234567' },
  { email: 'example1@gmail.com', password: 'password1' },
  { email: 'example2@gmail.com', password: 'password2' },
]

// Kiểm tra lỗi cơ bản
const schemaBase = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email', // Kiểm tra định dạng email
      minLength: 1,
      errorMessage: {
        minLength: 'Email không được để trống.',
        format: 'Email không hợp lệ.',
      },
    },
    password: {
      type: 'string',
      minLength: 6,
      errorMessage: {
        minLength: 'Mật khẩu phải có ít nhất 6 ký tự.',
      },
    },
  },
  additionalProperties: false,
}

// Kiểm tra lỗi xác thực với danh sách tài khoản hợp lệ
const schemaLogin = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  additionalProperties: false,
  anyOf: loginList.map((item) => ({
    properties: {
      email: { const: item.email },
      password: { const: item.password },
    },
    errorMessage: {
      const: 'Thông tin đăng nhập không chính xác.',
    },
  })),
}

const a = ref(true)
// // Chọn schema dựa trên việc có đủ dữ liệu nhập hay không
// const schema = formData.email && formData.password ? schemaLogin : schemaBase

// Hàm xử lý sự kiện submit
const onSubmit = () => {
  // Reset lỗi
  validationErrors.value = {}

  // Validate với schemaBase trước
  const { errors: baseErrors } = validateData(formData, schemaBase)
  validationErrors.value = baseErrors
  console.log(validationErrors.value)
  // Nếu không có lỗi trong schemaBase, tiếp tục kiểm tra với schemaLogin
  if (Object.keys(baseErrors).length === 0) {
    a.value = false
    const { errors: loginErrors } = validateData(formData, schemaLogin)
    validationErrors.value = loginErrors

    // Kiểm tra kết quả cuối cùng
    if (Object.keys(loginErrors).length === 0) {
      // Nếu không có lỗi, hiển thị thông báo thành công và chuyển hướng
      $q.notify({
        type: 'positive',
        message: 'Đăng nhập thành công!',
      })
      router.push('/') // Điều hướng về trang chủ
    } else {
      // Nếu có lỗi, hiển thị lỗi
      console.log('Validation errors:', validationErrors.value)
      $q.notify({
        type: 'negative',
        message: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin!',
      })
    }
  }
}
</script>
