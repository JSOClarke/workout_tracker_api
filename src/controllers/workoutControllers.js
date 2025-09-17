import * as workoutService from "../services/workoutServices.js";

import logger from "../config/logger.js";

export const testDBConnection = async (req, res) => {
  try {
    await workoutService.testDb();
    res.status(200).send("Succesfull connection to the database");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listWorkouts = async (req, res) => {
  let result;
  const { sub } = req.user;
  const { is_completed } = req.query;
  console.log(typeof is_completed);
  try {
    if (typeof is_completed !== "undefined") {
      const boolean_is_completed = is_completed === "true";
      console.log("boolean_is_completed", boolean_is_completed);
      result = await workoutService.gatherWorkoutsByStatus(
        sub,
        boolean_is_completed
      );
    } else {
      console.log("All runs");
      result = await workoutService.gatherWorkouts(sub); // returns the rows so should be a array of objects i believe
    }
    res.status(200).json(result || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listWorkoutExercises = async (req, res) => {
  const { sub } = req.user;
  const { workout_id } = req.params;

  try {
    const result = await workoutService.gatherWorkExercises(workout_id, sub);
    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }
    console.log("result", result);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listExerciseWithSets = async (req, res) => {
  const { sub } = req.user;
  const { workout_exercise_id } = req.params;
  console.log("workout_exercise_id", workout_exercise_id);

  try {
    const result = await workoutService.gatherExerciseWithSets(
      sub,
      workout_exercise_id
    );
    console.log("result", result);
    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  const { sub } = req.user;
  const { workout_id } = req.query;

  const numerical_workout_id = Number(workout_id);

  try {
    const result = await workoutService.deleteWorkoutById(
      numerical_workout_id,
      sub
    );

    if (result.length == 0) {
      return res.status(404).json({
        error: "No content found",
      });
    }
    console.log("result length", result.length);
    console.log("result", result);

    res.status(200).send("Succefully removed the workout");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addWorkout = async (req, res) => {
  const { sub } = req.user;
  const { scheduled_date } = req.body;

  try {
    const result = await workoutService.createWorkout(sub, scheduled_date);
    if (result.length == 0) {
      return res.status(400).send("DB couldnt insert the workout");
    }
    res
      .status(200)
      .send("Sucesfully added the workout send back the ID next time tho");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addWorkoutExercises = async (req, res) => {
  const { workout_id, excerise_id, order_in } = req.body;
  const numeric_workout_id = Number(workout_id);
  const numeric_excerise_id = Number(excerise_id);

  try {
    const result = await workoutService.createWorkoutExercise(
      numeric_workout_id,
      numeric_excerise_id,
      order_in
    );
    if (!result || result.length === 0) {
      return res
        .status(400)
        .send("DB not able to create work exercise query but no error");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addExerciseSets = async (req, res) => {
  const { workout_exercise_id, reps, weight, comment } = req.body;

  try {
    const result = await workoutService.createExerciseSet(
      workout_exercise_id,
      reps,
      weight,
      comment
    );
    if (!result || result.length === 0) {
      return res
        .status(400)
        .send("DB not able to create set query but no error");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteWorkoutExercise = async (req, res) => {
  const { workout_exercise_id } = req.query;

  const numerical_workout_exercise_id = Number(workout_exercise_id);

  try {
    const result = await workoutService.deleteWorkoutExerciseById(
      numerical_workout_exercise_id
    );

    // if there were any errors it would push to the catch book auto without needing to return a err from the service
    console.log("result", result);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

// jwt will basically sign the payload with a key that you can store in cookies
