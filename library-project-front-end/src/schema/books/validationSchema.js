import { messageError } from '../../messageError/messageError'

export const bookSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, errorMessage: messageError.title },
    author: { type: 'string', minLength: 1, errorMessage: messageError.author },
    genre: { type: 'string', minLength: 1, errorMessage: messageError.genre },
    quantity: { type: 'integer', minimum: 1 },
    total_quantity: { type: 'integer', minimum: 1 },
    published_year: {
      type: 'integer',
      minimum: 1000,
      maximum: new Date().getFullYear(),
    },
    description: { type: 'string' },
    cover_image_url: {},
  },
  additionalProperties: false,
  allOf: [
    {
      properties: {
        total_quantity: { minimum: { $data: '1/quantity' } },
      },
    },
  ],
}
