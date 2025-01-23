<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8"
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
import { validateData } from 'src/components/Validator.js'

// Cấu trúc dữ liệu cho form
const isPwd = ref(true)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
  date: '',
  phone: '',
})

const validationErrors = ref({})

// Định nghĩa schema để kiểm tra
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1, // Không được để trống
      errorMessage: {
        type: 'Tên phải là một chuỗi.',
        minLength: 'Tên không được để trống.',
      },
    },
    date: {
      type: 'string',
      format: 'date', // Kiểm tra định dạng ngày
      minLength: 1, // Không được để trống
      errorMessage: {
        type: 'Ngày sinh phải là một chuỗi.',
        format: 'Ngày sinh không đúng định dạng (yyyy-mm-dd).',
        minLength: 'Ngày sinh không được để trống.',
      },
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10,11}$', // Chỉ cho phép số, độ dài từ 10-15 ký tự
      minLength: 1, // Không được để trống
      errorMessage: {
        type: 'Số điện thoại phải là một chuỗi.',
        pattern: 'Số điện thoại không hợp lệ. Chỉ chứa số và có độ dài từ 10 đến 15 ký tự.',
        minLength: 'Số điện thoại không được để trống.',
      },
    },
    email: {
      type: 'string',
      format: 'email', // Kiểm tra định dạng email
      minLength: 1, // Không được để trống
      errorMessage: {
        type: 'Email phải là một chuỗi.',
        format: 'Email không hợp lệ.',
        minLength: 'Email không được để trống.',
      },
    },
    password: {
      type: 'string',
      minLength: 6, // Độ dài tối thiểu là 6 ký tự
      errorMessage: {
        type: 'Mật khẩu phải là một chuỗi.',
        minLength: 'Mật khẩu phải có ít nhất 6 ký tự.',
      },
    },
    confirmpassword: {
      type: 'string',
      const: { $data: '1/password' }, // Phải khớp với trường password
      errorMessage: {
        const: 'Mật khẩu xác nhận không khớp.',
      },
    },
  },
}

// Hàm xử lý khi submit form
const onSubmit = () => {
  const { errors } = validateData(formData, schema)
  // Cập nhật lỗi nếu không hợp lệ
  validationErrors.value = errors
}
</script>
