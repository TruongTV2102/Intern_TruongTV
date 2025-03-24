export const borrowRequestSchema = {
  body: {
    type: "object",
    required: ["user_id", "books"],
    properties: {
      user_id: { type: "integer" },
      books: {
        type: "array",
        items: { type: "integer" },
        minItems: 1,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const approveBorrowSchema = {
  params: {
    type: "object",
    required: ["borrow_item_id"],
    properties: {
      borrow_item_id: { type: "integer" },
    },
  },
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["Pending", "Approved", "Rejected", "Returned", "Lost"],
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
