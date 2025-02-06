<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="tw-bg-primary tw-text-white" height-hint="98">
      <q-toolbar class="tw-flex tw-items-center tw-justify-between tw-gap-4">
        <q-toolbar-title class="tw-max-w-[15%] tw-flex">
          <div @click="goToHome" class="tw-cursor-pointer tw-flex tw-items-center">
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
            </q-avatar>
            <span class="tw-ml-2 tw-text-lg tw-font-semibold">Library</span>
          </div>
        </q-toolbar-title>

        <q-btn-dropdown flat rounded class="tw-relative" icon="account_circle" label="Tài khoản">
          <template v-if="isLoggedIn">
            <q-list separator>
              <q-item clickable v-ripple @click="goToProfile">
                <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                <q-item-section>Trang cá nhân</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToChangePassword">
                <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                <q-item-section>Đổi mật khẩu</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Thoát</q-item-section>
              </q-item>
            </q-list>
          </template>

          <template v-else>
            <q-list separator>
              <q-item clickable v-ripple @click="goToLogin">
                <q-item-section avatar><q-icon name="login" /></q-item-section>
                <q-item-section>Đăng nhập</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToRegister">
                <q-item-section avatar><q-icon name="edit" /></q-item-section>
                <q-item-section>Đăng ký</q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="500"
      class="tw-w-[15%]"
      side="left"
      bordered
      :scrolling="false"
      :height="'100vh'"
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple @click="goToHome">
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Trang chủ</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="goToLoanStatus">
            <q-item-section avatar><q-icon name="book" /></q-item-section>
            <q-item-section>Sách đang mượn</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="goToHistory">
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Lịch sử mượn sách</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="">
      <router-view :search-query="searchQuery" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logoutUser, getCurrentUser } from 'src/utils/loginData'

const isLoggedIn = computed(() => !!getCurrentUser())
const leftDrawerOpen = ref(true)
const router = useRouter()

const goToHome = () => router.push('/')
const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
const goToProfile = () => router.push('/profile')
const goToLoanStatus = () => router.push('/loanstatus')
const goToHistory = () => router.push('/history')
const goToChangePassword = () => router.push('/changepassword')
const logout = () => {
  logoutUser()
  router.push('/login')
}
</script>
