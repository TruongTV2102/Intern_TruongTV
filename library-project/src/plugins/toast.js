import { Notify } from 'quasar'

export const toast = {
  info: (message) => {
    Notify.create({
      type: 'positive',
      message,
    })
  },
  error: (message) => {
    Notify.create({
      type: 'negative',
      message,
    })
  },
}
