import { messageError } from 'src/messageError/messageError'

export const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email', // Kiểm tra định dạng email
      minLength: 1, // Không được để trống
      errorMessage: {
        type: messageError.emailtype,
        format: messageError.emailformat,
        minLength: messageError.emailempty,
      },
    },
    password: {
      type: 'string',
      minLength: 6,
      errorMessage: {
        minLength: messageError.passwordempty,
      },
    },
  },
  additionalProperties: false,
}
