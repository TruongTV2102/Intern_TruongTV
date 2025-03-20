export const registerSchema = {
  type: "object",
  required: [
    "name",
    "email",
    "password",
    "confirmpassword",
    "birthday",
    "phone",
  ],
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 50,
    },
    email: { type: "string", format: "email", minLength: 1 },
    password: {
      type: "string",
      minLength: 6,
      pattern: "^(?!\\s).+$", // Không chứa khoảng trắng
    },
    confirmpassword: {
      type: "string",
    },
    birthday: {
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$", // yyyy-mm-dd
    },
    phone: {
      type: "string",
      pattern: "^\\d{10,11}$", // 10 hoặc 11 số
    },
  },
  additionalProperties: false,
};

export const changePasswordSchema = {
  body: {
    type: "object",
    required: ["email", "oldPassword", "newPassword"],
    properties: {
      email: { type: "string", format: "email" },
      oldPassword: { type: "string", minLength: 6 },
      newPassword: { type: "string", minLength: 6 },
    },
  },
};

export const resetPasswordSchema = {
  bode: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
    },
  },
};
