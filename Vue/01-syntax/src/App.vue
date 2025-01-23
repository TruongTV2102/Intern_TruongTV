<script setup>
  const message = 'hello world!!!';
  const rawHtml = '<div><h1>Title</h1><span style="color: red">This should be red</span></div>'
  const buttonId = 'button-id';
  let btnClass = 'btn';
  const isButtonDisable = false;
  const objectOfAttrs = {
    id: 'container',
    class: 'wrapper',
    style: 'background-color:gray'
}
  const number = 2;
</script>

<template>
  <h1>Syntax</h1>


  <!--  Bindings -->

  <!--render biến bằng cách {{ biến muốn render }}-->
  <p>Message: {{ message }}</p> 
  
  <!-- HTML thô : dùng (v-html="") -->
  <span v-html="rawHtml"></span>

  <!-- Ràng buộc thuộc tính: gán thuộc tính bằng (v-bind:thuộc tính="") hoặc rút gọn (:thuộc tính) -->
   <button v-bind:id="buttonId" :class="btnClass" :disabled="isButtonDisable">Click here</button>
  
   <!-- Ràng buộc nhiều thuộc tính bằng (v-bind = "") -->
   <button v-bind="objectOfAttrs">Click đee</button>

  <!-- Sử dụng biểu thức trong Bindings -->
   <button>Number: {{ number*2}}</button>

   <!-- Toán tử 3 ngôi -->
   <button v-bind:id="buttonId" :class="btnClass" :disabled="isButtonDisable">{{ isButtonDisable ?'Disabled': 'Click here!' }}</button>

</template>

