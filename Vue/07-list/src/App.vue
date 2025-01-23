<script setup>
  import { reactive, ref } from 'vue'

  const shoppingItems = ref([
    {
      name:"apple",
      price: 7,
    },
    {
      name: "orange",
      price: 12,
    },
    {
      name: "orange",
      price: 12,
    },
  ])

  // const user = ref({
  //   firstName: "John",
  //   lastName: "Doe",
  //   age: 30,
  // });

  const users = ref([
    {
      firstName: "John",
      age: 30,
      isActive: true,
    },
    {
      firstName: "Bob",
      age: 30,
      isActive: false,
    },
    {
      firstName: "Carol",
      age: 30,
      isActive: true,
    },
    
  ]);


  const newTodo = ref('')
  const todos = reactive([
    {
      id: 1,
      text: "Learn vuejs",
    },
    {
      id: 2,
      text: "Build a todo app",
    },    
  ]);

  const addTodo = () => {
    if(newTodo.value.trim() === '') return;
      const todo = {
        id: todos.length +1,
        text: newTodo.value
      }
    todos.push(todo);
    newTodo.value = "";
  }
</script>

<template>
  <div>
    <!-- v-model="" là khi nhập giá trị vào text thì giá trị của newTodo cũng thay đổi theo và ngược lại -->
    <input type="text" v-model="newTodo">  
    <button @click="addTodo">Add todo</button>
    <ul>
      <!-- <li v-for="item in shoppingItems" :key="item.name">
        {{item.name}} - {{ item.price }}
      </li> -->


      <!-- kết hợp v-if và v-for -->
      <!-- <template v-for="(user, index) in users">
        <li v-if="user.isActive" :key="user.firstName">
          {{ user.firstName }}: {{ user.isActive ? "Active" : "Deactive" }}({{ index }})
        </li>      
      </template> -->


      <li v-for="todo in todos"  :key="todo.id">
          {{ todo.text }}
      </li>

    </ul>
  </div>
</template>

<style>

</style>