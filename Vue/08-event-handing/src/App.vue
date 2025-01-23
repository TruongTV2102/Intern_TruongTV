<script setup>
import { ref } from "vue";
  const count = ref(0)

  const greet = (event) => {
    alert('Hello')
  }

  const sayHi = (name) => {
    alert(`Hello ${name}`)
  }

  const submit = () => {
    alert("Form submitted");
  };
</script>

<template>
  <h1>Event handing</h1>
  <!-- v-on dùng để gọi event -->
  <button v-on:click="greet">Thêm 1</button>
  <p>{{ count }}</p>

  <button @click="sayHi('A')">Hello</button>
  <br>

  <!-- (.stop) dùng để ngăn chặn event lan ra thằng cha -->
  <!-- <button @click="sayHi('A')">HelloA
    <button @click.stop="sayHi('B')">HelloB</button>
  </button>  -->
  <br>


  <!-- (.prevent) dùng để ngăn chặn hành vi mặc định của event -->
  <form @submit.prevent="submit">
    <button type="submit">Submit</button>
  </form>

  <!-- (.self) kiểm tra xem event đó có phải chính phẩn tử đó không  -->
   <!-- giúp tránh sự kiện nổi bọt -->
  <button @click="sayHi('A')">HelloA
    <button @click.self="sayHi('B')">HelloB</button>
  </button>

  <!-- key modified là dùng để thêm chức năng của bàn phím vào event  -->
  <div>
    <input @keyup.enter.alt="submit" type="text" placeholder="Nhập tên của bạn">
  </div>
</template>

<style>

</style>