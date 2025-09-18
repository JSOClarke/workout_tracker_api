import request from "supertest";
import app from "../src/app.js";
import YAML from "yamljs";

jest.mock("yamljs", () => ({
  load: jest.fn(() => ({})),
}));

test("POST /users/login should return 200 and token", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({ email: "EMAIL@gmail.com", password: "PASSWORD" });

  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});
