<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8 tw-ml-[300px]"
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

      <div class="tw-text-center tw-text-sm tw-flex tw-justify-between">
        <p
          class="tw-mr-4 tw-text-blue-600 hover:tw-underline tw-cursor-pointer"
          @click="goToPage('/register')"
        >
          Register now
        </p>
        <p
          class="tw-text-blue-600 hover:tw-underline tw-cursor-pointer"
          @click="goToPage('/forgorpassword')"
        >
          Forgot password?
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { validateData } from 'src/components/validator'
import { toast } from 'src/plugins/toast'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getLoginList, initLoginList, setCurrentUser } from 'src/utils/loginData.js'
import { loginSchema } from 'src/schema/login/validationSchema'
const router = useRouter()
const isPwd = ref(true)
const rememberMe = ref(false)

// Biến reactive để chứa form và lỗi
const formData = reactive({
  email: '',
  password: '',
})

const validationErrors = ref({})

// Hàm xử lý sự kiện submit
const onSubmit = () => {
  const { errors, isValid } = validateData(formData, loginSchema)
  validationErrors.value = errors

  if (isValid) {
    const loginList = getLoginList()
    const user = loginList.find(
      (item) => item.email === formData.email && item.password === formData.password,
    )
    if (user) {
      setCurrentUser(user)
      toast.info('Đăng nhập thành công!')
      router.push('/')
    } else {
      toast.error('Tài khoản hoặc mật khẩu không đúng!')
    }
  }
}

const goToPage = (path) => {
  router.push(path)
}

onMounted(() => {
  initLoginList()
})
</script>
