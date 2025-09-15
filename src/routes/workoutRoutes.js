import express from "express";
import {
  testExercises,
  testWorkouts,
} from "../controllers/workoutControllers.js";
const routes = express.Router();

// LIST Workouts

// routes.get("/list", listWorkouts);
routes.get("/list/workouts", testWorkouts);
routes.get("/list/exercises", testExercises);

export default routes;
