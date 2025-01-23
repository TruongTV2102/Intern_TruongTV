<script setup>
  import { computed, nextTick, reactive, ref } from 'vue'
  // Sử dụng ref để khai báo state 
  const count = ref(0);
  // count.value++;

  const increase = async() => {
    count.value++;
    console.log(document.getElementById('count').innerText);
    // nextTick()dùng giống như promise phải dùng async/await
    await nextTick()
    console.log(document.getElementById('count').innerText);

  }

  //ref có thể theo dõi đối tượng object, array, object lồng object, ...
  // const object = ref( {
  //   count: 2,
  //   user: {
  //     age:18,
  //   },
  //   array: [1, 2, 3],
  // })
  // const change = () => {
  //   object.value.count++
  //   object.value.array.push(4)
  // };

  //Khi sử dụng object nên sử dụng reactive thay cho ref thì chúng ta sẽ không cần qua value nữa mà thay đổi trực tiếp luôn
  const object = reactive( {
    count: 2,
    user: {
      age:18,
    },
    array: [1, 2, 3],
  })
  const change = () => {
    object.count++
    object.array.push(4)
  };

  const book = reactive({
    name: 'Book 1',
    chapter: [],
  })
  
const addChapter = () => {
  book.chapter.push('Chapter')
}

// computed là một đối tượng dùng để khai báo các thuộc tính tính toán dựa trên các state và được cập nhật tự động nếu như cái state phụ thuộc thay đổi
// computed chỉ đọc thôi 
const isPublished = computed(() => {
  return book.chapter.length > 0?'Có':'Không'
});


const firstName = ref('Nguyễn Văn')
const lastName = ref('A');

// cách viết writable computed để ghi đè 1 cái computed
const fullName = computed( {
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(',')
  }
})

const changeFullName = () => {
  fullName.value = "Nguyễn Văn,B"
}

  </script>

<template>
<div>
  <!-- Khi render trong <template></template> thì chỉ sử dụng tên biến mà thôi  -->
  <p id="count">{{ count }}</p>

  <!-- Sử dụng event để tương tác -->
  <button @click="increase">Increase</button>
  <button @click="count--">Decrease</button>

  <p>{{ object.count }}</p>
  <p>{{ object.array }}</p>
  <button @click="change">Decrease</button>
</div>
<div>
  <p id="count">Book name: {{ book.name }}</p>
  <p id="count">Đã xuất bản: {{ isPublished }}</p>
  <button @click="addChapter">Add chapter</button>


  <p id="count">FullName: {{ fullName }}</p>
  <button @click="changeFullName">Change Name</button>

</div>
</template>

