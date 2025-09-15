import express from "express";
import {
  deleteWorkout,
  listWorkExercises,
  listWorkouts,
} from "../controllers/workoutControllers.js";
const routes = express.Router();

// LIST Workouts

// routes.get("/list", listWorkouts);
routes.get("/workouts", listWorkouts);
routes.get("/exercises", listWorkExercises);
routes.delete("/workouts", deleteWorkout);

export default routes;
