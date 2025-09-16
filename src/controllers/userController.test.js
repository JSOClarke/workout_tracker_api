import * as userControllers from "./userController.js";

test("Hash a password using bccrypt", async () => {
  const password = "Yourcrax";
  const hash = await userControllers.hashPassword(password);

  expect(hash).not.toBe(password);
  console.log(hash);

  const isCorrect = await userControllers.isPasswordCorrect(hash, password);

  console.log(isCorrect);
  expect(isCorrect).toBe(true);
});
