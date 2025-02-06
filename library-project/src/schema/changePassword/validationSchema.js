import { messageError } from 'src/messageError/messageError'

export const changePasswordSchema = {
  type: 'object',
  properties: {
    oldpassword: {
      type: 'string',
      minLength: 6, // Độ dài tối thiểu là 6 ký tự
      errorMessage: {
        type: messageError.passwordtype,
        minLength: messageError.passwordempty,
      },
    },
    newpassword: {
      type: 'string',
      minLength: 6, // Độ dài tối thiểu là 6 ký tự
      errorMessage: {
        type: messageError.passwordtype,
        minLength: messageError.passwordempty,
      },
    },
    confirmnewpassword: {
      type: 'string',
      const: { $data: '1/newpassword' }, // Phải khớp với trường password
      errorMessage: {
        const: messageError.confirmpasswordconst,
      },
    },
  },
}
