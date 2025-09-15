import { error } from "console";
import * as workoutService from "../services/workoutServices.js";
// Makes sense to use the query paramters for the lists eg list?status=pending

export const listWorkouts = async (req, res) => {
  try {
    const result = await workoutService.gatherWorkouts(); // returns the rows so should be a array of objects i believe
    console.log("result", result);
    if (result.length === 0 || !result) {
      return res
        .status(400)
        .json({ error: "Not able to find any data from database" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Database error" });
  }
};

export const listWorkExercises = async (req, res) => {
  const { workout_id } = req.query;
  try {
    const result = await workoutService.gatherWorkExercises(workout_id);
    if (result.length === 0) {
      return res
        .status(200)
        .json({ data: "No workout_exercises Data found inside of workout" });
    }
    console.log("result", result);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  const { workout_id } = req.query;

  const numerical_workout_id = Number(workout_id);

  try {
    const result = await workoutService.deleteWorkoutById(numerical_workout_id);

    if (result.rowCount == 0) {
      return res.status(400).json({
        error:
          "Workout Was not deleted by db query went through and didnt error",
      });
    }
    // if there were any errors it would push to the catch book auto without needing to return a err from the service
    console.log("result", result);

    res.status(200).send("Succefully removed the workout");
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};
