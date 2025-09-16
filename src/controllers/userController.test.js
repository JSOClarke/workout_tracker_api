import { hashPassword } from "./userController.js";

test("Hash a password using bccrypt", async () => {
  const password = "Yourcrax";
  const hash = await hashPassword(password);

  expect(hash).not.toBe(password);
});
