<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <!-- Logo và Library -->
        <q-toolbar-title class="tw-max-w-[15%]">
          <div @click="goToHome" class="tw-cursor-pointer tw-flex tw-items-center">
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
            </q-avatar>
            <span class="tw-ml-2">Library</span>
          </div>
        </q-toolbar-title>

        <!-- Nút Tài khoản -->
        <q-btn-dropdown
          flat
          rounded
          class="tw-absolute tw-right-0"
          icon="account_circle"
          label="Tài khoản"
        >
          <template v-if="isLoggedIn">
            <!-- Menu sau khi đăng nhập -->
            <q-list separator>
              <q-item clickable v-ripple @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="account_circle" />
                </q-item-section>
                <q-item-section>Trang cá nhân</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToFavorites">
                <q-item-section avatar>
                  <q-icon name="book" />
                </q-item-section>
                <q-item-section>Tình trạng sách đang mượn</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToStore">
                <q-item-section avatar>
                  <q-icon name="history" />
                </q-item-section>
                <q-item-section>Lịch sử mượn sách</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Thoát</q-item-section>
              </q-item>
            </q-list>
          </template>

          <template v-else>
            <!-- Menu trước khi đăng nhập -->
            <q-list separator>
              <q-item clickable v-ripple @click="goToLogin">
                <q-item-section avatar>
                  <q-icon name="login" />
                </q-item-section>
                <q-item-section>Đăng nhập</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToRegister">
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>Đăng ký</q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Nội dung trang -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Biến trạng thái
const isLoggedIn = ref(false)

// Sử dụng router
const router = useRouter()

// Các phương thức điều hướng
const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToFavorites = () => {
  router.push('/favorites')
}

const goToStore = () => {
  router.push('/store')
}

const logout = () => {
  // Xử lý đăng xuất
  isLoggedIn.value = false
  router.push('/login')
}
</script>
