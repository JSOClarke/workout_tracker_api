import express from "express";
import * as workoutController from "../controllers/workoutControllers.js";
const routes = express.Router();

routes.get("/", workoutController.listWorkouts);
routes.get(
  "/generateReport/:workout_id",
  workoutController.listWorkoutExercises
);
routes.delete("/", workoutController.deleteWorkout);
routes.post("/", workoutController.addWorkout);

routes.get("/health", workoutController.testDBConnection);

routes.post("/exercises", workoutController.addWorkoutExercises);
routes.get(
  "/exercises/:workout_exercise_id",
  workoutController.listExerciseWithSets
);
routes.delete("/exercises", workoutController.deleteWorkoutExercise);

routes.post("/exercises/set", workoutController.addExerciseSets);

export default routes;
