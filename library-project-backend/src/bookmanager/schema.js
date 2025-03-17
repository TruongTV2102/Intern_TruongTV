export const bookSchema = {
  body: {
    type: "object",
    required: ["title", "author", "genre", "published_year", "quantity"],
    properties: {
      title: { type: "string", minLength: 1 },
      author: { type: "string", minLength: 1 },
      genre: { type: "string", minLength: 1 },
      published_year: { type: "integer", minimum: 0 },
      quantity: { type: "integer", minimum: 1 },
      total_quantity: { type: "integer", minimum: 1 },
      cover_image_id: { type: "integer", nullable: true },
    },
  },
};
