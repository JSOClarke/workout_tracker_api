import request from "supertest";
import app from "../src/app.js";

test("POST /users/login should return 200 and token", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({ email: "test@example.com", password: "pass123" });

  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});
