<script setup>
  import { ref } from 'vue'

  const isLoggedIn= ref(true);

  const toggleLogin = () => {
    isLoggedIn.value = !isLoggedIn.value
  }

  const userStatus = ref('online')

  const changeStatus = () => {
    if (userStatus.value === 'online') {
      userStatus.value = 'away'
    }else if (userStatus.value === 'away') {
      userStatus.value = 'busy'
    } else if(userStatus.value ==='busy') {
      userStatus.value = 'online'
    }
  }

  const isVisible = ref(true);
  const toggleShow = () => {
    isVisible.value = !isVisible.value
  }
  </script>

<template>
  <!-- (v-if/v-else) dùng để thêm hoặc loại bỏ 1 phần tử khỏi DOM -->
   <div>
    <h1 v-if="isLoggedIn">(^-^)</h1>
    <h1 v-else>(*,*)</h1>
    <button @click="toggleLogin">{{ isLoggedIn ? 'Đăng xuất': 'Đăng nhập'}}</button>
   
    <br>
    <h1 class="" v-if="userStatus ==='online'">Người dùng online</h1>
    <h1 v-else-if="userStatus ==='away'">Người dùng vắng mặt</h1>
    <h1 v-else-if="userStatus ==='busy'">Người dùng bận</h1>
    <h1 v-else>Không rõ trạng thái</h1>

    <button @click="changeStatus">Thay đổi trạng thái</button>
    <br>
    <h1 v-show="isVisible">Nội dung này ẩn hoặc hiển thị</h1>
    <button @click="toggleShow">{{ isVisible ? 'Ẩn': 'Hiện'}}</button>




   </div>
</template>

<style>

</style>