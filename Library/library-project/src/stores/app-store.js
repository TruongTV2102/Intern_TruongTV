import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const user = ref(null)

  function setUser(userInfo) {
    user.value = userInfo
  }

  return { user, setUser }
})
