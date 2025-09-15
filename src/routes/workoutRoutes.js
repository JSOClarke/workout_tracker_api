import express from "express";
import * as workoutController from "../controllers/workoutControllers.js";
const routes = express.Router();

routes.get("/workouts", workoutController.listWorkouts);
routes.delete("/workouts", workoutController.deleteWorkout);
routes.post("/workouts", workoutController.addWorkout);
routes.get("/workouts/status", workoutController.listWorkoutsByStatus);

routes.get("/exercises", workoutController.listWorkExercises);
routes.post("/exercises", workoutController.addWorkoutExercises);
routes.post("/exercise/set", workoutController.addExerciseSets);
export default routes;
