<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="tw-bg-primary tw-text-white" height-hint="98">
      <q-toolbar class="tw-flex tw-items-center tw-justify-between tw-gap-4">
        <q-toolbar-title class="tw-max-w-[15%] tw-flex">
          <div @click="goToPage('/')" class="tw-cursor-pointer tw-flex tw-items-center">
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
            </q-avatar>
            <span class="tw-ml-2 tw-text-lg tw-font-semibold">Library</span>
          </div>
        </q-toolbar-title>

        <q-btn-dropdown flat rounded class="tw-relative" label="Tài khoản">
          <template v-if="userStore.currentUser">
            <div flat class="tw-m-[4px]">
              <q-avatar size="30px">
                <img :src="userStore.currentUser.avatar" alt="avatar" />
              </q-avatar>
              <span class="q-ml-xs">{{ userStore.currentUser.name }}</span>
            </div>

            <q-list separator>
              <q-item clickable v-ripple @click="goToPage('/profile')">
                <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                <q-item-section>Trang cá nhân</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToPage('/changepassword')">
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
              <q-item clickable v-ripple @click="goToPage('/login')">
                <q-item-section avatar><q-icon name="login" /></q-item-section>
                <q-item-section>Đăng nhập</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToPage('/register')">
                <q-item-section avatar><q-icon name="edit" /></q-item-section>
                <q-item-section>Đăng ký</q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="userStore.currentUser"
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
          <q-item clickable v-ripple @click="goToPage('/')">
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Trang chủ</q-item-section>
          </q-item>

          <q-item
            v-if="userStore.currentUser.role === 'user'"
            clickable
            v-ripple
            @click="goToPage('/loanstatus')"
          >
            <q-item-section avatar><q-icon name="book" /></q-item-section>
            <q-item-section>Sách đang mượn</q-item-section>
          </q-item>

          <q-item
            v-if="userStore.currentUser.role === 'user'"
            clickable
            v-ripple
            @click="goToPage('/history')"
          >
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Lịch sử mượn sách</q-item-section>
          </q-item>

          <q-item
            v-if="userStore.currentUser.role === 'admin'"
            clickable
            v-ripple
            @click="goToPage('/manageusers')"
          >
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Quản lý người dùng</q-item-section>
          </q-item>

          <q-item
            v-if="userStore.currentUser.role === 'admin'"
            clickable
            v-ripple
            @click="goToPage('/managebooks')"
          >
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Quản lý sách</q-item-section>
          </q-item>

          <q-item
            v-if="userStore.currentUser.role === 'admin'"
            clickable
            v-ripple
            @click="goToPage('/loanrequestmanagement')"
          >
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Yêu cầu mượn sách</q-item-section>
          </q-item>

          <q-item
            v-if="userStore.currentUser.role === 'admin'"
            clickable
            v-ripple
            @click="goToPage('/returnmanagement')"
          >
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Yêu cầu trả sách</q-item-section>
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
// import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/userStore'

const router = useRouter()

const userStore = useUserStore()

const goToPage = (path) => {
  router.push(path)
}

const logout = () => {
  userStore.logoutUser()
  router.push('/login')
}
</script>
