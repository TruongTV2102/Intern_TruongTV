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
          <!--Old Password -->
          <q-input
            ref="oldPasswordInput"
            v-model="formData.oldpassword"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Old Password"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.oldpassword"
            :error-message="validationErrors.oldpassword"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!--New Password -->
          <q-input
            ref="newPasswordInput"
            v-model="formData.newpassword"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="New Password"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.newpassword"
            :error-message="validationErrors.newpassword"
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
            ref="confirmNewPasswordInput"
            v-model="formData.confirmnewpassword"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Confirm New Password"
            class="tw-px-4 tw-py-3"
            :error="!!validationErrors.confirmnewpassword"
            :error-message="validationErrors.confirmnewpassword"
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
import { validateData } from 'src/components/validator.js'
import { getLoginList } from 'src/utils/loginData'
import { toast } from 'src/plugins/toast'
import { useRouter } from 'vue-router'
import { changePasswordSchema } from 'src/schema/changePassword/validationSchema'

// Cấu trúc dữ liệu cho form
const isPwd = ref(true)
const router = useRouter()

const formData = reactive({
  oldpassword: '',
  newpassword: '',
  confirmnewpassword: '',
})

const validationErrors = ref({})

const onSubmit = () => {
  const { errors, isValid } = validateData(formData, changePasswordSchema)
  // Cập nhật lỗi nếu không hợp lệ
  validationErrors.value = errors

  if (isValid) {
    const users = getLoginList()
    const user = users.find((u) => u.password === formData.oldpassword)

    if (user) {
      user.password = formData.newpassword

      localStorage.setItem('loginList', JSON.stringify(users))
      toast.info('Đổi mật khẩu thành công!')
      router.push('/')
    } else {
      toast.error('Mật khẩu không đúng!!!')
    }
  }
}
</script>
