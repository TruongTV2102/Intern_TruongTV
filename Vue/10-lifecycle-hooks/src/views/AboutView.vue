<template>
  <div class="about">
    <!-- <h1>Timer: {{ time }}</h1> -->
    <h1>Count: {{ count }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onUpdated, ref } from 'vue';

// const time = ref(0);
// let intervalId = null;
const count = ref(0);
const increment = () => {
  count.value++
}

// onBeforeMount(() => {
//   console.log("onBeforeMount")
// })

// onMounted(() => {
//   intervalId = setInterval(() => {
//     time.value++
//   },1000)
// });

// onBeforeUnmount(() => {
//   console.log("onBeforeUnmount")
// })

// onUnmounted(() => {
//   clearInterval(intervalId);
// });

onBeforeUpdate(() => {
  console.log(`"onBeforeUpdate" Count:${count.value}`)
})

onUpdated(() => {
  console.log("onUpdate")
})

</script>


