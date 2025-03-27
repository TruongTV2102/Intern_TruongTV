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
import { validateData } from 'src/schema/validator.js'
import { forgotPasswordSchema } from 'src/schema/forgotPassword/validationSchema'
import { api } from 'src/api'
import { toast } from 'src/plugins/toast'

const formData = reactive({
  email: '',
})

const validationErrors = ref({})
const message = ref('')
const loading = ref(false)

// Hàm xử lý khi submit form
const onSubmit = async () => {
  const { errors, isValid } = validateData(formData, forgotPasswordSchema)
  validationErrors.value = errors || {}

  if (isValid) {
    loading.value = true
    try {
      const response = await api.post('/reset-password', {
        email: formData.email,
      })

      toast.info(response.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      loading.value = false
    }
  }
}
</script>
