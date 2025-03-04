import { users } from "./users.js";

export const findUser = (email, password) => {
  return users.find(
    (user) => user.email === email && user.password === password
  );
};
