<template>
  <div class="tw-mb-4 tw-flex tw-justify-center">
    <q-input
      v-model="searchQuery"
      placeholder="Tìm kiếm sách theo tên, tác giả, thể loại..."
      class="tw-w-full tw-max-w-2xl tw-bg-white"
      outlined
      dense
      @keyup.enter="emitSearch"
    >
      <template v-slot:append>
        <q-btn flat round dense icon="search" @click="emitSearch" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const emit = defineEmits(['update:searchQuery'])

const emitSearch = () => {
  emit('update:searchQuery', searchQuery.value)
}
</script>
