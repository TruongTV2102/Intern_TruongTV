<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated> </q-header>

    <q-drawer> </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
const bien = ref(0)
console.log(bien)
</script>
