export const bookSchema = {
  $id: "bookSchema",
  type: "object",
  properties: {
    id: { type: "string" },
    name: {
      type: "string",
      minLength: 1,
    },
    bookcode: {
      type: "string",
      minLength: 1,
    },
    author: {
      type: "string",
      minLength: 1,
    },
    genre: {
      type: "string",
      minLength: 1,
    },
    year: {
      type: "integer",
      minimum: 1900,
      maximum: new Date().getFullYear(),
    },
    quantity: {
      type: "string",
      minLength: 1,
    },
    totalQuantity: {
      type: "string",
      minLength: 1,
    },
  },
  required: [
    "name",
    "bookcode",
    "author",
    "genre",
    "year",
    "quantity",
    "totalQuantity",
  ],
  additionalProperties: false,
};
