export const returnLostSchema = {
  type: "object",
  properties: {
    borrow_id: { type: "integer", minimum: 1 },
    status: { type: "string", enum: ["Returned", "Lost"] },
    fine: { type: "number", minimum: 0 },
  },
  required: ["borrow_id", "status"],
  additionalProperties: false,
};
