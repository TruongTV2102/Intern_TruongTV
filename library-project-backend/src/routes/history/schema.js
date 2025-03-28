export const userHistorySchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    genre: { type: "string" },
    author: { type: "string" },
    published_year: { type: ["integer", "null"] },
    status: {
      type: "string",
      enum: ["Pending", "Approved", "Rejected", "Returned", "Lost"],
    },
    page: { type: "integer", minimum: 1, default: 1 },
    limit: { type: "integer", minimum: 1, default: 10 },
    sortBy: {
      type: "string",
      enum: [
        "title",
        "author",
        "genre",
        "published_year",
        "borrow_date",
        "due_date",
        "return_date",
        "status",
      ],
      default: "borrow_date",
    },
    descending: { type: "boolean", default: false },
  },
};

export const bookHistorySchema = {
  params: {
    type: "object",
    properties: {
      book_id: { type: "integer" },
    },
    required: ["book_id"],
  },
};

export const historyQuerySchema = {
  type: "object",
  properties: {
    user_name: { type: "string" },
    title: { type: "string" },
    genre: { type: "string" },
    author: { type: "string" },
    published_year: { type: ["integer", "null"] },
    status: {
      type: "string",
      enum: ["Pending", "Approved", "Rejected", "Returned", "Lost"],
    },
    page: { type: "integer", minimum: 1, default: 1 },
    limit: { type: "integer", minimum: 1, default: 10 },
    sortBy: {
      type: "string",
      enum: [
        "title",
        "user_name",
        "author",
        "genre",
        "published_year",
        "borrow_date",
        "due_date",
        "return_date",
        "status",
      ],
      default: "borrow_date",
    },
    descending: { type: "boolean", default: false },
  },
};
