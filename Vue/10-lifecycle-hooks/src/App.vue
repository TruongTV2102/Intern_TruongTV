<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="header">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
  </header>

  <RouterView />
</template>

<style>

</style>
