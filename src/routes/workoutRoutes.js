import express from "express";
import * as workoutController from "../controllers/workoutControllers.js";
const routes = express.Router();

// WORKOUTS
routes.patch("/:workout_id", workoutController.updateWorkoutById);

routes.get("/", workoutController.listWorkouts);

routes.get("/generateReport/", workoutController.listWorkoutExercises);
routes.get(
  "/generateReport/:workout_id",
  workoutController.listWorkoutExercises
);
routes.delete("/", workoutController.deleteWorkout);
routes.post("/", workoutController.addWorkout);

routes.patch(
  "/exercises/:workout_exercise_id",
  workoutController.updateWorkoutExercise
);

routes.get("/health", workoutController.testDBConnection);

// WORKOUTS EXERCISES
routes.post("/exercises", workoutController.addWorkoutExercises);
routes.get(
  "/exercises/:workout_exercise_id",
  workoutController.listExerciseWithSets
);
routes.delete("/exercises", workoutController.deleteWorkoutExercise);

// WORKOUTS SETS

routes.post("/exercises/set", workoutController.addExerciseSets);
routes.patch(
  "/exercises/set/:set_id",
  workoutController.updateWorkoutExerciseSet
);

export default routes;
