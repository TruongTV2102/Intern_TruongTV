<script setup>
import { reactive, ref, watch, watchEffect } from "vue";

const x = ref(0);
const y = ref(0);

const user = reactive({
  age: 18,
  class: {
    student: 0,
    name: "Linh",
  }
})

watch(
  () => x.value + y.value, 
  (sum) => {
    console.log(`Tổng của x và y là: ${sum}`)
  }
)

watch([x, () => y.value + 1], ([newX, newY]) => {
  console.log(`Giá trị cập nhật: ${newX}, ${newY} `)
})

watch(user, (newUser, oldUser) => {
  console.log(`User: ${JSON.stringify(newUser)}, ${JSON.stringify(oldUser)}`)
},{deep: false, immediate: true}) //deep dùng để khi watch quan sát sâu bên trong object con lồng object 
// mà khi deep là false thì giá trị không thay đổi 
// còn ở trong object cha thì không ảnh hưởng

watchEffect(() => {
  console.log(`Giá trị x: ${x.value}, y: ${y.value} `)
})

watchEffect(() => {
  console.log(`User: ${JSON.stringify(user)} `)
})


const increment = () => {
  x.value++;
  y.value++;
};

const changeAge = () => {
  user.class.student++
  user.age++
}

// const question = ref("");
// const isLoading = ref(false);
// const answer = ref("");

//watchers là một cách để theo dõi sự thay đổi của các biến phản ứng (reactive variables) hoặc thuộc tính (properties), 
//từ đó thực hiện các hành động phụ thuộc khi giá trị của chúng thay đổi.
// watch(question, async (newQuestion, oldQuestion) => {
//   if (newQuestion.includes("?")) {
//     isLoading.value = true;
//     answer.value = "Đang suy nghĩ...";
//     try {
//       const response = await fetch("http://yesno.wtf/api");
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       answer.value = data.answer;
//     } catch (error) {
//       console.error(error);
//       answer.value = "Không thể lấy câu trả lời. Vui lòng thử lại.";
//     } finally {
//       isLoading.value = false;
//     }
//   }
// });
</script>

<template>
  <!-- <div>
    <h1>Watchers</h1>
    <p>Hỏi một câu hỏi có thể trả lời bằng yes hoặc no</p>
    <input v-model="question" :disabled="isLoading" placeholder="Nhập câu hỏi tại đây">
    <p v-if="isLoading">Đang suy nghĩ...</p>
    <p v-else>{{ answer }}</p>
  </div> -->
  <div>
    <p>{{ x }}, {{ y }}</p>
    <button @click="increment" >Increment</button>

    <p>{{ user.age }}</p>
    <button @click="changeAge" >Increment</button>
  </div>

</template>


<style>

</style>