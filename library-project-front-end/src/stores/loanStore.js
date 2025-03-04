import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoanStore = defineStore('loanStore', () => {
  const loanRequests = ref([])
  const returnRequests = ref([])

  const addLoanRequest = (loan) => {
    loanRequests.value.push(loan)
  }

  const returnRequestsBook = (request) => {
    returnRequests.value.push(request)
  }

  const updateLoanStatus = (request, status) => {
    const index = loanRequests.value.findIndex(
      (r) => r.book?.id === request.book?.id && r.user?.email === request.user?.email,
    )
    loanRequests.value[index].status = status
  }

  const approveReturnRequest = (id, email) => {
    returnRequests.value = returnRequests.value.filter(
      (request) => !(request.book.id === id && request.user.email === email),
    )
    loanRequests.value = loanRequests.value.filter(
      (request) => !(request.book.id === id && request.user.email === email),
    )
  }

  return {
    loanRequests,
    returnRequests,
    addLoanRequest,
    updateLoanStatus,
    returnRequestsBook,
    approveReturnRequest,
  }
})
