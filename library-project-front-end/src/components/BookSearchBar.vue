<template>
  <div
    class="tw-flex tw-flex-wrap tw-items-center tw-gap-4 tw-border tw-border-gray-300 tw-p-4 tw-rounded-lg tw-bg-white tw-m-[10px]"
  >
    <q-input
      v-if="showBooksFilter"
      v-model="search.title"
      label="Tên sách"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
    />
    <q-input
      v-if="showBooksFilter"
      v-model="search.author"
      label="Tác giả"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
    />

    <q-select
      v-if="showBooksFilter"
      v-model="search.genre"
      :options="genres"
      option-value="name"
      option-label="name"
      label="Thể loại"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
      emit-value
      map-options
      @update:model-value="search.genre = $event || null"
    >
      <template v-if="search.genre" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="search.genre = null" class="cursor-pointer" />
      </template>
    </q-select>

    <q-input
      v-if="showBooksFilter"
      v-model="search.published_year"
      label="Năm xuất bản"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
      type="number"
      min="0"
      @update:model-value="search.published_year = $event ? parseInt($event, 10) : null"
    />

    <q-input
      v-if="showEmailFilter"
      v-model="search.email"
      label="Email"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
      type="email"
    />

    <q-select
      v-if="statusOptions.length"
      v-model="search.status"
      :options="statusOptions"
      label="Trạng thái"
      class="tw-w-full sm:tw-max-w-xs"
      outlined
      dense
      emit-value
      map-options
    >
      <template v-if="search.status" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="search.status = null" class="cursor-pointer" />
      </template>
    </q-select>

    <template v-if="showDateFilters">
      <q-input
        v-model="search.borrow_date"
        label="Ngày mượn"
        class="tw-w-full sm:tw-max-w-xs"
        outlined
        dense
        type="date"
      />
      <q-input
        v-model="search.return_date"
        label="Ngày trả"
        class="tw-w-full sm:tw-max-w-xs"
        outlined
        dense
        type="date"
      />
    </template>

    <q-btn
      unelevated
      color="primary"
      icon="search"
      @click="emitSearch"
      class="tw-h-10 tw-w-10 sm:tw-w-auto"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, API_ROUTES } from 'src/api'

const search = ref({
  title: '',
  author: '',
  email: '',
  genre: '',
  published_year: '',
  status: '',
  borrow_date: '',
  return_date: '',
})

const genres = ref([])
const statusOptions = ref([])
const showBooksFilter = ref(false)
const showDateFilters = ref(false) // Điều chỉnh khi cần hiển thị bộ lọc ngày
const showEmailFilter = ref(false) // Điều chỉnh khi cần hiển thị tìm kiếm theo email

const emit = defineEmits(['search'])

const emitSearch = () => {
  const searchData = { ...search.value }

  if (!showDateFilters.value) {
    delete searchData.borrow_date
    delete searchData.return_date
  }

  if (!showEmailFilter.value) {
    delete searchData.email
  }

  if (!statusOptions.value.length) {
    delete searchData.status
  }

  emit('search', searchData)
}

const fetchGenres = async () => {
  try {
    const response = await api.get(API_ROUTES.GENRES)
    genres.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thể loại:', error)
  }
}

// Cập nhật danh sách trạng thái cho từng trang
const setStatusOptions = (options) => {
  statusOptions.value = options
}

const setShowBooksFilter = (value) => {
  showBooksFilter.value = value
}

// Bật/tắt bộ lọc ngày
const setShowDateFilters = (value) => {
  showDateFilters.value = value
}

// Bật/tắt tìm kiếm theo email
const setShowEmailFilter = (value) => {
  showEmailFilter.value = value
}

onMounted(fetchGenres)

defineExpose({ setShowBooksFilter, setStatusOptions, setShowDateFilters, setShowEmailFilter })
</script>
