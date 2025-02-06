import { messageError } from '../../messageError/messageError'

export const registerSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: {
        type: messageError.nametype,
        minLength: messageError.nameempty,
      },
    },
    date: {
      type: 'string',
      format: 'date',
      minLength: 1,
      errorMessage: {
        type: messageError.datetype,
        format: messageError.dateformat,
        minLength: messageError.dateempty,
      },
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10,11}$',
      minLength: 1,
      errorMessage: {
        type: messageError.phonetype,
        pattern: messageError.phonepattern,
        minLength: messageError.phoneempty,
      },
    },
    email: {
      type: 'string',
      format: 'email',
      minLength: 1,
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
        type: messageError.passwordtype,
        minLength: messageError.passwordempty,
      },
    },
    confirmpassword: {
      type: 'string',
      const: { $data: '1/password' },
      errorMessage: {
        const: messageError.confirmpasswordconst,
      },
    },
  },
}
