export const searchSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 },
    date: {
      type: 'object',
      properties: {
        from: { type: 'string', format: 'date' },
        to: { type: 'string', format: 'date' },
      },

      nullable: true,
    },
  },
  required: ['title'],
}
