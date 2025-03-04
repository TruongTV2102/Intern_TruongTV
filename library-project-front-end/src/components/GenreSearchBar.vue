<template>
  <div class="tw-mb-4 tw-flex tw-justify-center">
    <q-input
      v-model="searchQuery"
      placeholder="Tìm kiếm sách theo tên, tác giả, thể loại..."
      class="tw-w-full tw-max-w-2xl tw-bg-white"
      outlined
      dense
      ref="my-input"
      @keyup.enter="emitSearch"
    >
      <template v-slot:append>
        <!-- Select để chọn trường tìm kiếm -->
        <q-select outlined v-model="model" :options="options" dense />
        <q-btn flat round dense icon="search" @click="emitSearch" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const input = useTemplateRef('my-input')
const emit = defineEmits(['update:searchQuery'])
const searchQuery = ref('')
const model = ref('Tên sách') // Giá trị mặc định là 'Tên sách'
const router = useRouter()
const route = useRoute()

onMounted(() => {
  input.value.focus()
})

const options = ['Tên sách', 'Tác giả', 'Thể loại', 'Năm']

const emitSearch = () => {
  // Kiểm tra xem có đang ở trang tìm kiếm không
  if (route.path === '/search') {
    if (searchQuery.value) {
      // Truyền cả search_query và search_field vào query
      router.replace({
        query: {
          ...route.query,
          search_query: searchQuery.value,
          search_field: model.value, // Truyền giá trị đã chọn trong q-select
        },
      })
      emit('update:searchQuery', searchQuery.value)
    } else {
      router.replace({
        query: {
          ...route.query,
          search_query: undefined,
          search_field: model.value, // Truyền giá trị đã chọn trong q-select
        },
      })
      emit('update:searchQuery', '')
    }
  } else {
    if (searchQuery.value) {
      // Chuyển hướng đến trang tìm kiếm với cả query của search_query và search_field
      router.push({
        path: '/search',
        query: {
          search_query: searchQuery.value,
          search_field: model.value, // Truyền giá trị đã chọn trong q-select
        },
      })
    } else {
      router.push({ path: '/' }) // Quay lại trang chủ nếu không có tìm kiếm
    }
  }
  searchQuery.value = ''
}
</script>
