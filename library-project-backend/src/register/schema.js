export const registerSchema = {
  type: "object",
  required: ["name", "email", "password", "confirmpassword", "date", "phone"],
  properties: {
    name: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
    confirmpassword: { type: "string" },
    date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    phone: { type: "string", pattern: "^\\d{10}$" },
  },
  additionalProperties: false,
};
