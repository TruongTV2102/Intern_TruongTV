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
import { useRouter, useRoute } from 'vue-router'

const emit = defineEmits(['update:searchQuery'])
const searchQuery = ref('')
const router = useRouter()
const route = useRoute()

const emitSearch = () => {
  if (route.path === '/search') {
    if (searchQuery.value) {
      router.replace({ query: { ...route.query, search_query: searchQuery.value } })
      emit('update:searchQuery', searchQuery.value)
    } else {
      router.replace({ query: { ...route.query, search_query: undefined } })
      emit('update:searchQuery', '')
    }
  } else {
    if (searchQuery.value) {
      router.push({ path: '/search', query: { search_query: searchQuery.value } })
    } else {
      router.push({ path: '/' }) // Quay lại trang chủ nếu không có tìm kiếm
    }
  }
}
</script>
