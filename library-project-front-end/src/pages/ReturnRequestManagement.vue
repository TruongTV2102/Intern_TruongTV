<template>
  <q-page class="q-pa-md">
    <q-table
      flat
      bordered
      title="Danh sách đơn hàng"
      :rows="orders"
      :columns="columns_request"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" label="Chi tiết" @click="viewDetails(props.row.id)" />
          <q-btn
            color="primary"
            label="Đồng ý tất cả"
            @click="confirmApprove(props.row.id)"
            class="q-ml-sm"
            :disable="props.row.status !== 'Pending'"
          />
          <q-btn
            color="red"
            label="Từ chối tất cả"
            @click="confirmReject(props.row.id)"
            class="q-ml-sm"
            :disable="props.row.status !== 'Pending'"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog Chi tiết đơn hàng -->

    <q-dialog v-model="detailDialog">
      <q-table
        style="height: 750px"
        flat
        bordered
        :rows="orderItem"
        :columns="columns_items"
        row-key="id"
        virtual-scroll
        :rows-per-page-options="[0]"
        v-model:pagination="pagination"
        @update:pagination="updateSort"
      >
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <q-img
              :src="props.row.cover_image_url || defaultImage"
              class="tw-w-16 tw-h-24 tw-object-cover tw-rounded-md"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-badge :color="statusColors[props.row.status]">{{
              getStatusLabel(props.row.status)
            }}</q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <template v-if="props.row.status === 'Pending'">
              <q-btn
                color="green"
                label="Duyệt"
                dense
                @click="updateStatus(props.row, 'Approved')"
              />
              <q-btn
                color="red"
                label="Từ chối"
                dense
                class="tw-ml-2"
                @click="updateStatus(props.row, 'Rejected')"
              />
            </template>
          </q-td>
        </template>
      </q-table>

      <!-- Phân trang -->
      <PaginationPage
        v-model:page="page"
        :total="total"
        :limit="limit"
        @update:page="fetchBorrowHistory"
      />
    </q-dialog>

    <!-- Dialog xác nhận -->
    <q-dialog v-model="confirmDialog"
      ><q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận</div>
        </q-card-section>
        <q-card-section>
          Bạn có chắc chắn muốn {{ confirmActionText }} đơn hàng này không?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn color="primary" label="Đồng ý" @click="executeAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/api'
import PaginationPage from 'src/components/PaginationPage.vue'
import { formatDate } from 'src/utils/dateUtils'
import { toast } from 'src/plugins/toast'

const orders = ref([])
const detailDialog = ref(false)
const confirmDialog = ref(false)
const confirmActionText = ref('')
const actionType = ref('')
const selectedOrderId = ref(null)

const orderItem = ref([])
const total = ref(0)
const page = ref(1)
const limit = 5
const search = ref({})
const defaultImage =
  'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'

const columns_request = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'user', label: 'Người mượn', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  {
    name: 'borrow_date',
    label: 'Ngày mượn',
    field: (row) => formatDate(row.borrow_date),
    align: 'left',
  },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

const columns_items = [
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', align: 'left', field: 'title', sortable: true },
  { name: 'user', label: 'Người mượn', align: 'left', field: 'user_name', sortable: true },
  {
    name: 'borrow_date',
    label: 'Ngày mượn',
    align: 'center',
    field: (row) => formatDate(row.borrow_date),
    sortable: true,
  },
  { name: 'status', label: 'Trạng thái', align: 'center', field: 'status', sortable: true },
  { name: 'actions', label: 'Hành động', align: 'center', field: 'actions', sortable: false },
]

const fetchOrders = async () => {
  const res = await api.get('/borrow-requests')
  orders.value = res.data
}

// const loading = ref(false)

const viewDetails = async (orderId) => {
  selectedOrderId.value = orderId
  detailDialog.value = true
  try {
    const res = await api.get(`/orders/${orderId}`, {
      params: {
        ...search.value,
        page: page.value,
        limit,
        sortBy: sortBy.value,
        descending: descending.value,
      },
    })
    orderItem.value = res.data.order.map((item) => ({
      ...item,
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử mượn sách:', error)
  }
}

const updateStatus = async (book, status) => {
  console.log('ID nhận được:', book.id)
  try {
    await api.put(`/approve-borrow/${book.id}`, { status })
    if (selectedOrderId.value) {
      viewDetails(selectedOrderId.value) // Gọi API với orderId đang mở
    }
  } catch (error) {
    toast.error(error.response?.data?.message)
    console.error('Lỗi khi cập nhật trạng thái:', error)
  }
}

const sortBy = ref('borrow_date') // Cột mặc định để sắp xếp
const descending = ref(false) // Sắp xếp tăng dần hoặc giảm dần

const pagination = ref({
  sortBy: 'borrow_date',
  descending: false,
})

const updateSort = (val) => {
  sortBy.value = val.sortBy
  descending.value = val.descending

  if (selectedOrderId.value) {
    viewDetails(selectedOrderId.value) // Gọi API với orderId đang mở
  }
}

const confirmApprove = (orderId) => {
  confirmActionText.value = 'chấp thuận tất cả'
  actionType.value = 'approve'
  selectedOrderId.value = orderId
  confirmDialog.value = true
}

const confirmReject = (orderId) => {
  confirmActionText.value = 'từ chối tất cả'
  actionType.value = 'reject'
  selectedOrderId.value = orderId
  confirmDialog.value = true
}

const executeAction = async () => {
  if (!selectedOrderId.value) return

  try {
    const status = actionType.value === 'approve' ? 'Approved' : 'Rejected'
    await api.put(`/approve-all/${selectedOrderId.value}`, { status })

    const orderIndex = orders.value.findIndex((order) => order.id === selectedOrderId.value)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = status
    }

    toast.info(`Đơn hàng đã được ${status === 'Approved' ? 'chấp thuận' : 'từ chối'}.`)
    confirmDialog.value = false
  } catch (error) {
    toast.error(error.response?.data?.message || 'Có lỗi xảy ra.')
    console.log(error)
  }
  confirmDialog.value = false
  fetchOrders()
}

onMounted(fetchOrders)
</script>
