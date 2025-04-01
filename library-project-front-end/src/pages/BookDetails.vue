<template>
  <q-page class="q-pa-md">
    <h1 class="tw-text-xl tw-font-semibold tw-mb-4">Danh sách đơn hàng</h1>

    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4">
      <q-input
        v-model="searchQuery"
        label="Tìm kiếm email..."
        outlined
        dense
        class="tw-w-1/3 tw-transition-all tw-duration-200 focus:tw-w-1/2"
      >
        <template v-slot:append>
          <q-btn flat round dense icon="search" color="primary" @click="fetchOrders" />
        </template>
      </q-input>
    </div>
    <q-table
      flat
      bordered
      :rows="orders"
      :columns="columns_request"
      row-key="id"
      virtual-scroll
      :rows-per-page-options="[0]"
      v-model:pagination="paginationDetails"
      @update:pagination="updateSortDetails"
    >
      <template v-slot:header-cell-status>
        <q-th>
          Trạng thái
          <q-btn flat dense icon="filter_list">
            <q-menu>
              <q-list>
                <q-item
                  clickable
                  v-for="option in statusDetailsOptions"
                  :key="option.value"
                  @click="updateStatusDetailsFilter(option.value)"
                >
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-th>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" label="Chi tiết" @click="showviewDetails(props.row.id)" />
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

    <!-- Phân trang -->
    <PaginationPage
      v-model:page="pageDetails"
      :total="totalDetails"
      :limit="limit"
      @update:page="fetchOrders"
    />

    <!-- Dialog Chi tiết đơn hàng -->
    <div>
      <q-dialog v-model="detailDialog">
        <q-card class="tw-w-[1500px]">
          <q-card-section>
            <div class="tw-text-lg tw-font-semibold">Đơn hàng {{ selectedOrderId }}</div>
          </q-card-section>
          <q-card-section>
            <q-table
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
              @update:page="handlePageChange"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Đóng" color="grey" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

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
const limit = 2
const search = ref({})
const defaultImage =
  'https://res.cloudinary.com/dp39ryiip/image/upload/v1742269732/ooe26eg7synamgmmycgk.jpg'

const columns_request = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'user', label: 'Người mượn', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  {
    name: 'created_at',
    label: 'Ngày yêu cầu',
    field: (row) => formatDate(row.created_at),
    align: 'left',
  },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'center' },
  { name: 'actions', label: 'Hành động', field: 'actions', align: 'center' },
]

const columns_items = [
  { name: 'image', label: 'Ảnh', align: 'center', field: 'cover_image_url', sortable: false },
  { name: 'title', label: 'Tên sách', align: 'left', field: 'title', sortable: true },
  { name: 'quantity', label: 'Số lượng', align: 'left', field: 'quantity', sortable: false },
  {
    name: 'total_quantity',
    label: 'Tổng số lượng',
    align: 'left',
    field: 'total_quantity',
    sortable: false,
  },
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

const searchQuery = ref('')
const statusDetail = ref('')
const pageDetails = ref(1)
const sortByDetails = ref('created_at')
const descendingDetails = ref(false)
const totalDetails = ref(0)

const fetchOrders = async () => {
  const res = await api.get('/borrow-requests', {
    params: {
      email: searchQuery.value,
      status: statusDetail.value,
      page: pageDetails.value,
      limit,
      sortBy: sortByDetails.value,
      descending: descendingDetails.value,
    },
  })

  orders.value = res.data.details
  totalDetails.value = res.data.total
}

const statusDetailsOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đã xử lý', value: 'Processed' },
  { label: 'Chưa xử lý', value: 'Pending' },
]

const updateStatusDetailsFilter = (status) => {
  statusDetail.value = status
  page.value = 1
  fetchOrders()
}

const paginationDetails = ref({
  sortBy: 'created_at',
  descending: false,
})

const updateSortDetails = (val) => {
  sortByDetails.value = val.sortBy
  descendingDetails.value = val.descending

  fetchOrders()
}

const showviewDetails = (user) => {
  detailDialog.value = true
  page.value = 1
  console.log('id', user)

  viewDetails(user)
}

const viewDetails = async (orderId) => {
  selectedOrderId.value = orderId

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
      fetchOrders()
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

const handlePageChange = () => {
  viewDetails(selectedOrderId.value)
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
