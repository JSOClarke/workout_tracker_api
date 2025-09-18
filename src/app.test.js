import request from "supertest";
import app from "../src/app.js";
import YAML from "yamljs";
import pool from "./config/db.js";
import {
  hashPassword,
  isPasswordCorrect,
} from "./controllers/userController.js";
import jwt from "jsonwebtoken";
import {
  createWorkout,
  createWorkoutExercise,
} from "./services/workoutServices.js";

jest.mock("yamljs", () => ({
  load: jest.fn(() => ({})),
}));

const golden_base = {
  name: "Jared",
  email: "EMAIL@gmail.com",
  password: "PASSWORD",
};

const user_content = [
  {
    title: "Happy Path - returns 200",
    email: golden_base.email,
    password: golden_base.password,
    expectedResponse: 200,
    checkToken: true,
  },
  {
    title: "Incorrect Password - returns 404",

    email: "EMAIL@gmail.com",
    password: "fpo",
    expectedResponse: 401,
    checkToken: false,
  },
  {
    title: "Missing Email - returns 400",

    password: "fpo",
    expectedResponse: 400,
    checkToken: false,
  },
  {
    title: "Missing Password - returns 400",

    email: "EMAIL@gmail.com",
    expectedResponse: 400,
    checkToken: false,
  },
  {
    title: "Incorrect Email - returns 401",

    email: "no_existing@user.com",
    password: "fpo",
    expectedResponse: 401,
    checkToken: false,
  },
];

const signup_data = [
  {
    title: "Happy Path - Returns 200",
    name: "Jordan",
    email: "tester@mail.com",
    password: "Mayye",
    expectedResponse: 200,
    checkToken: true,
  },
  {
    title: "Missing name - Returns 400",
    email: "tester@mail.com",
    password: "Mayye",
    expectedResponse: 400,
    checkToken: false,
  },
  {
    title: "Missing email - Returns 400",
    name: "Jordan",
    password: "Mayye",
    expectedResponse: 400,
    checkToken: false,
  },
  {
    title: "Missing email and name - Returns 400",

    password: "Mayye",
    expectedResponse: 400,
    checkToken: false,
  },
  {
    title: "Duplicate Email in DB - Return 500",
    name: "Jordan",
    email: golden_base.email,
    password: "Mayye",
    expectedResponse: 401,
    checkToken: false,
  },
];

const token = jwt.sign(
  { sub: 1, email: golden_base.email },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h",
  }
);

beforeEach(async () => {
  await pool.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
  const password_hash = await hashPassword(user_content[0].password);
  await pool.query(
    `INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3)`,
    [golden_base.name, user_content[0].email, password_hash]
  );

  console.log(`Database Reset`);
});

describe("User Login Integration Tests", () => {
  test.each(user_content)(
    "POST /users/login with %o → %s",
    async ({ email, password, expectedResponse, checkToken = false }) => {
      const res = await request(app)
        .post("/users/login")
        .send({ email, password });
      expect(res.statusCode).toBe(expectedResponse);
      if (checkToken === true) {
        expect(typeof res.body.token).toBe("string");
      }
    }
  );
});

describe("User Signup Integration Tests", () => {
  test.each(signup_data)(
    "POST /users/signup with -> %s",
    async ({ name, email, password, expectedResponse, checkToken }) => {
      const res = await request(app)
        .post("/users/signup")
        .send({ name, email, password });

      expect(res.statusCode).toBe(expectedResponse);
      if (checkToken === true) {
        expect(typeof res.body.token).toBe("string");
      }
    }
  );
});

const getDD = [
  {
    title: "Happy Path - Return 200",
    query: { is_completed: "true" },

    expectedResponse: 200,
    expectedBody: "object",
  },
  {
    title: "Happy Path with param - Return 200",
    query: { is_completed: "true" },

    expectedResponse: 200,
    expectedBody: "object",
  },
  {
    title: "Invalid query value - Return 400",
    query: { is_completed: "truef" },

    expectedResponse: 400,
    expectedBody: "object",
  },

  {
    title: "Incorect query key - Return 400",
    query: { wrong: "wrong" },
    expectedResponse: 400,
    expectedBody: "object",
  },
];

describe("GET /workouts", () => {
  beforeEach(async () => {
    const result = await createWorkout(1, "2025-09-24T10:00:00");
    console.log("result", result);
    const workout_id = result.workout_id;
    await createWorkoutExercise(workout_id, 15, 1);
  });

  test.each(getDD)(
    "GET /workouts %s",
    async ({ query, expectedResponse, expectedBody }) => {
      const res = await request(app)
        .get("/workouts")
        .query(query)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(expectedResponse);
      expect(typeof res.body).toBe(expectedBody);
    }
  );
});

const generateReportData = [
  {
    title: "Happy Path - return 200",
    path_param: 1,
    expectedResponse: 200,
    expectedBody: "object",
  },
  {
    title: "Invalid ID format - return 400",
    path_param: "abc",
    expectedResponse: 400,
    expectedBody: "object",
  },
  {
    title: "Non-existent ID - return 404",
    path_param: 9999,
    expectedResponse: 404,
    expectedBody: "object",
  },
  {
    title: "Zero ID - return 400",
    path_param: 0,
    expectedResponse: 400,
    expectedBody: "object",
  },
  {
    title: "Negative ID - return 400",
    path_param: -5,
    expectedResponse: 400,
    expectedBody: "object",
  },
];

describe("GenerateReports Endpoint Intergration Tests", () => {
  test.each(generateReportData)(
    "GET /workouts/generateReports %s",
    async ({ path_param, expectedResponse, expectedBody }) => {
      const res = await request(app)
        .get(`/workouts/generateReport/${path_param}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(expectedResponse);
      expect(typeof res.body).toBe(expectedBody);
    }
  );
});
