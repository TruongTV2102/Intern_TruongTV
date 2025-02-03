<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8"
  >
    <div class="tw-w-full tw-max-w-[500px] tw-px-4 tw-py-6 tw-bg-white tw-rounded-lg tw-shadow-lg">
      <header class="tw-h-[130px] tw-flex tw-items-center tw-justify-center">
        <div class="model-header tw-text-[30px] tw-font-semibold">Login</div>
      </header>

      <q-form @submit="onSubmit" ref="formRef">
        <!-- Form bắt sự kiện submit -->
        <div class="q-gutter-y-md column tw-space-y-4">
          <!-- Email -->
          <q-input
            ref="emailInput"
            clearable
            filled
            v-model="formData.email"
            label="Email"
            class="tw-px-4 tw-py-3"
          />

          <!-- Password -->
          <q-input
            ref="passwordInput"
            v-model="formData.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            class="tw-px-4 tw-py-3"
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

      <!-- Links -->
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
import { useQuasar } from 'quasar'
import { validateData } from 'src/components/validator.js'

// Quasar Notify
const $q = useQuasar()

// Form data
const isPwd = ref(true)
const rememberMe = ref(false)

const formData = reactive({
  email: '',
  password: '',
})

const validationErrors = ref({})
const loginList = [
  { email: 'truongtv', password: '1234567' },
  { email: 'example1', password: 'password1' },
  { email: 'example2', password: 'password2' },
]

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  additionalProperties: false,
  anyOf: loginList.map((item) => ({
    properties: {
      email: {
        const: item.email,
        errorMessage: {
          const: 'Email không hợp lệ!',
        },
      },
      password: {
        const: item.password,
        errorMessage: {
          const: 'Mật khẩu không chính xác!',
        },
      },
    },
  })),
}

// Ref for the form
const formRef = ref(null)

// Handle form submission
const onSubmit = () => {
  const { errors } = validateData(formData, schema)
  validationErrors.value = errors

  // Kiểm tra kết quả
  if (Object.keys(errors).length === 0) {
    // Nếu hợp lệ
    $q.notify({
      message: 'Đăng nhập thành công!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right',
    })
  } else {
    // Nếu không hợp lệ
    $q.notify({
      message: 'Đăng nhập thất bại!',
      color: 'negative',
      icon: 'error',
      position: 'top-right',
    })
  }
}
</script>
