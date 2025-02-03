<template>
  <div
    class="tw-items-center tw-justify-center flex tw-fixed tw-inset-0 tw-bg-gray-50 tw-px-4 tw-py-8"
  >
    <div class="tw-w-full tw-max-w-[500px] tw-px-4 tw-py-6 tw-bg-white tw-rounded-lg tw-shadow-lg">
      <header class="tw-h-[130px] tw-flex tw-items-center tw-justify-center">
        <div class="model-header tw-text-[30px] tw-font-semibold">Login</div>
      </header>

      <div class="q-gutter-y-md column tw-space-y-4">
        <q-input clearable filled v-model="email" label="Email" class="tw-px-4 tw-py-2" />
        <div class="tw-flex tw-items-center tw-justify-center tw-mb-4">
          <q-btn
            color="primary"
            label="Send the new password via email"
            class="tw-px-6 tw-py-2 tw-rounded-md tw-w-[95%]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
</script>

<style>
* {
  /* Emmet */
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
