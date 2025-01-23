<script setup>
import { onMounted, ref } from "vue";

const inputRef = ref(null);
const list = ref(["Item1", "Item2", "Item3"]);
const itemRefs = ref([])
onMounted(() => {
  inputRef.value.focus();

  itemRefs.value.forEach((item) => {
    item.style.transition = 'opacity 5s';
    item.style.opacity = 1;
  })
})

const initializeThirdPartyLibrary = (el) => {
  console.log(el)
}

</script>

<template>
  <h1>Template refs</h1>
  <!-- template refs dùng khi muốn tác động trực tiếp vào dom thật -->
  <input ref="inputRef">

  <!-- refs dùng cùng với v-for -->
  <ul>
    <li v-for="(item, index) in list" :key="index" ref="itemRefs" style="opacity: 0;">{{ item }}</li>
  </ul>

  <!-- refs theo kiểu hàm -->
  <input :ref="(el) => {
    initializeThirdPartyLibrary(el)
    }">
</template>


<style>

</style>