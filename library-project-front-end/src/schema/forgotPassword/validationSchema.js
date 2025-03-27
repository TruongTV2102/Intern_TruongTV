import { messageError } from 'src/messageError/messageError'

export const forgotPasswordSchema = {
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
  },
  additionalProperties: false,
}
