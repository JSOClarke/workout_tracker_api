import request from "supertest";
import app from "../src/app.js";
import YAML from "yamljs";

jest.mock("yamljs", () => ({
  load: jest.fn(() => ({})),
}));

const user_content = [
  {
    email: "EMAIL@gmail.com",
    password: "PASSWORD",
    expected_respond: 200,
    checkToken: true,
  },
  {
    email: "EMAIL@gmail.com",
    password: "fpo",
    expected_respond: 500,
    checkToken: false,
  },
  {
    password: "fpo",
    expected_respond: 404,
    checkToken: false,
  },
  {
    email: "EMAIL@gmail.com",
    expected_respond: 404,
    checkToken: false,
  },
  {
    email: "no_existing@user.com",
    password: "fpo",
    expected_respond: 401,
    checkToken: false,
  },
];

describe("User Login Integration Tests", () => {
  test.each(user_content)(
    "POST /users/login with %o → %s",
    async ({ email, password, expected_respond, checkToken = false }) => {
      const res = await request(app)
        .post("/users/login")
        .send({ email, password });
      expect(res.statusCode).toBe(expected_respond);
      if (checkToken === true) {
        expect(typeof res.body.token).toBe("string");
      }
    }
  );
});
