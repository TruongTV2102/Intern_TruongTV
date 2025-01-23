<script setup>
import {ref } from "vue";
 const text = ref("")

const checkedNames = ref([]);

</script>

<template>
  <div>
    <h1>Form Input Bindings</h1>
    <p>{{ text }}</p>
   <!-- v-model="" là khi nhập giá trị vào text thì giá trị của phần tử cũng thay đổi theo và ngược lại --> 
    <input v-model="text" placeholder="Search">

    <!-- <p>Checkbox: {{ checkedNames }}</p>
    <input id="a" type="checkbox" v-model="checkedNames" value="A">
    <label for="a">A</label>
    <input id="b" type="checkbox" v-model="checkedNames" value="B">
    <label for="b">B</label> -->


    <p>Radio: {{ checkedNames }}</p>
    <input id="a" type="radio" v-model="checkedNames" value="A">
    <label for="a">A</label>
    <input id="b" type="radio" v-model="checkedNames" value="B">
    <label for="b">B</label>

    <p>Select: {{ text }}</p>
    <!-- (.lazy) (chỉ dùng cho v-model) Giá trị sẽ chỉ được cập nhật sau khi người dùng 
     rời khỏi input (sự kiện change), tức là sau khi họ hoàn tất việc 
     chỉnh sửa và nhấn phím "Enter" hoặc click ra ngoài. -->
    <input v-model.lazy="text" placeholder="Search">
  </div>
</template>

<style>

</style>