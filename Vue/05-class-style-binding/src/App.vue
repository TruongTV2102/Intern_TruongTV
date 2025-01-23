<script setup>
  import {reactive, ref } from 'vue'

  const isActive = ref(true);
  const background = ref('blue');
  const styleObject = reactive({
    border: 'none',
    borderRadius: '6px',
    color: 'blue'
  })

  </script>

<template>
  <button class="button" :class="{active: isActive}">Active</button>
  <button :style="{
    color: 'red',
    background
  }">
  Button</button>
  <button :style="styleObject">BTN</button>
</template>

<style>
  .button {
    border: none;
    color: red;
    background-color: blue;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
      background-color: violet;
      color: black;
    }
  }
  .active {


    background-color: #321562;
    color: aliceblue;
    &:hover {
      background-color: greenyellow;
      color: black;
    }
  }

  .has-error {
    background-color: orange;
    color: gray;
    &:hover {
      background-color: pink;
      color: burlywood;
    }
  }
</style>