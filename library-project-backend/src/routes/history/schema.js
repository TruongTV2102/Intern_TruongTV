export const userHistorySchema = {
  params: {
    type: "object",
    properties: {
      user_id: { type: "integer" },
    },
    required: ["user_id"],
  },
  querystring: {
    type: "object",
    properties: {
      title: { type: "string" },
      genre: { type: "string" },
      author: { type: "string" },
      published_year: { type: "integer" },
      status: {
        type: "string",
        enum: ["Pending", "Approved", "Returned", "Lost", "Rejected"],
      },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, default: 8 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        history: {
          type: "array",
          items: {
            type: "object",
            properties: {
              book_id: { type: "integer" },
              cover_image_url: { type: "string" },
              author: { type: "string" },
              genre: { type: "string" },
              title: { type: "string" },
              published_year: { type: "integer" },
              status: { type: "string" },
              borrow_date: { type: "string", format: "date-time" },
              due_date: { type: "string", format: "date-time" },
              return_date: { type: ["string", "null"], format: "date-time" },
            },
          },
        },
        total: { type: "integer" },
      },
    },
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
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: { type: "integer" },
          name: { type: "string" },
          status: { type: "string" },
          borrow_date: { type: "string", format: "date-time" },
          return_date: { type: ["string", "null"], format: "date-time" },
        },
      },
    },
  },
};
