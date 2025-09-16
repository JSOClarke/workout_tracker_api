import express from "express";
import workoutRoutes from "./routes/workoutRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import unless from "express-unless";
import { authMiddleware } from "../middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

// // Wrap authMiddleware with unless to exclude login/signup
// authMiddleware.unless = unless;
// const protectedMiddleware = authMiddleware.unless({
//   path: ["/users/login", "/users/signup"],
// });

app.use("/users", userRoutes);

app.use("/workouts", authMiddleware, workoutRoutes);

// app.use("/", workoutRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server is up on PORT:", process.env.PORT)
);
