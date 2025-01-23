<template>
  <div>
    <div class="tw-w-96">
      <div class="modal-close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#5f6368"
        >
          <path
            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
          />
        </svg>
      </div>
      <header>
        <div class="model-header">Login</div>
      </header>
      <div class="q-gutter-y-md column" style="max-width: 300px">
        <q-input clearable filled v-model="email" label="Email" />
        <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" label="Password">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>

      <div class="flex">
        <q-checkbox right-label v-model="left" label="Remember me" />
        <q-btn color="primary" label="LOGIN" />
      </div>

      <div>
        <a href="#">Register now</a>
        <a href="#">Forgot password?</a>
      </div>
    </div>
    <div>
      <img src="" alt="" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      email: ref(''),
      password: ref(''),
      isPwd: ref(true),
      left: ref(true),
    }
  },
}
</script>

<style>
* {
  /* Emmet */
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* .modal {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
} */

/* .login {
  background-color: #fff;
  width: 900px;
  max-width: calc(100% - 32px);
  min-height: 80%;
  position: relative;
} */

.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  padding: 12px;
  cursor: pointer;
  opacity: 0.9;
}

.model-header {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
</style>
