<template>
  <q-page class="tw-p-4">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Giỏ hàng</h1>

    <q-card v-if="cartStore.cart.length === 0" flat bordered class="tw-p-6 tw-text-center">
      <q-icon name="shopping_cart" size="lg" color="gray" class="tw-mb-2" />
      <p class="tw-text-gray-500">Giỏ hàng của bạn đang trống.</p>
    </q-card>

    <q-table
      v-else
      style="height: 750px"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-img
            :src="
              props.row.cover_image_url ||
              'https://res.cloudinary.com/dp39ryiip/image/upload/v1742114106/afffiepjj3j41aqbp9td.jpg'
            "
            class="tw-w-16 tw-h-24 tw-object-cover tw-rounded-md"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            label="Xoá sách"
            icon="delete"
            color="red"
            flat
            round
            size="sm"
            @click="cartStore.removeBook(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <div class="tw-mt-6 tw-flex tw-justify-between">
      <q-btn
        label="Xóa tất cả"
        color="red"
        icon="delete_sweep"
        class="tw-px-4 tw-py-2"
        :disable="cartStore.cart.length === 0"
        @click="cartStore.clearCart"
      />
      <q-btn
        label="Xác nhận mượn"
        color="primary"
        icon="check_circle"
        class="tw-px-4 tw-py-2"
        :disable="cartStore.cart.length === 0"
        @click="confirmDialog = true"
      />
    </div>

    <!-- Dialog xác nhận -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận</div>
        </q-card-section>
        <q-card-section> Bạn có chắc chắn muốn xác nhận đơn hàng này không? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn color="primary" label="Đồng ý" @click="confirmBorrow" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from 'src/stores/cartStore'
import { toast } from 'src/plugins/toast'

const cartStore = useCartStore()

const columns = [
  { name: 'index', label: '#', align: 'left', field: 'index' },
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', align: 'left', field: 'title', sortable: true },
  { name: 'author', label: 'Tác giả', align: 'left', field: 'author', sortable: true },
  { name: 'genre', label: 'Thể loại', align: 'left', field: 'genre_name', sortable: true },
  {
    name: 'published_year',
    label: 'Năm xuất bản',
    align: 'center',
    field: 'published_year',
    sortable: true,
  },
  { name: 'actions', label: 'Hành động', align: 'center', field: 'actions', sortable: false },
]

// Tạo danh sách sách từ giỏ hàng
const rows = computed(() => cartStore.cart.map((item, index) => ({ ...item, index: index + 1 })))

// Pagination
const pagination = ref({
  rowsPerPage: 20,
})

// Biến kiểm soát Dialog
const confirmDialog = ref(false)

// Xác nhận mượn sách
const confirmBorrow = async () => {
  try {
    await cartStore.borrowBooks()
    toast.info('Xác nhận mượn thành công!')
    confirmDialog.value = false
  } catch (error) {
    toast.error(error || 'Có lỗi xảy ra, vui lòng thử lại.')
  }
}
</script>
