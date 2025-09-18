import * as workoutService from "../services/workoutServices.js";
import { z } from "zod";

const checkParamIsNum = (param) => {
  const numeric_param = Number(param);
  if (isNaN(numeric_param)) {
    throw new Error("Invalid Param");
  }
  return numeric_param;
};

export const testDBConnection = async (req, res) => {
  try {
    await workoutService.testDb();
    res.status(200).send("Succesfull connection to the database");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const workoutsSchema = z
  .object({
    is_completed: z
      .string()
      .optional()
      .refine((val) => val === "true" || val === "false" || val === undefined),
  })
  .strict();

export const listWorkouts = async (req, res) => {
  const parsed = workoutsSchema.safeParse(req.query);
  console.log("parsed", parsed);
  let result;
  const { sub } = req.user;

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  const { is_completed } = req.query;

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

// const listWorkoutExercisesSchema = z.object({
//   workout_id:z.number
// })

export const listWorkoutExercises = async (req, res) => {
  const { sub } = req.user;
  const { workout_id } = req.params;

  if (!workout_id) {
    return res.status(400).json({ error: "No workout_id provided as param" });
  }

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

  if (!workout_exercise_id) {
    return res
      .status(404)
      .json({ error: "No workout_exercise_id provided as param" });
  }

  try {
    const result = await workoutService.gatherExerciseWithSets(
      sub,
      workout_exercise_id
    );

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

  if (!workout_id) {
    return res.status(404).json({ error: "No workout_id provided as param" });
  }

  const numerical_workout_id = checkParamIsNum(workout_id);

  if (isNaN(numerical_workout_id)) {
    res.status(404).json({ error: "Invalid workout ID type provided" });
  }

  try {
    const result = await workoutService.deleteWorkoutById(
      numerical_workout_id,
      sub
    );

    if (!result.workout_id) {
      return res.status(500).json({
        error: "Workout not deleted from database",
      });
    }
    // console.log("result length", result.length);
    // console.log("result", result);

    res.status(200).json(result);
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
    if (!result.workout_id) {
      return res.status(500).send("DB couldnt insert the workout");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addWorkoutExercises = async (req, res) => {
  const { workout_id, excerise_id, order_in } = req.body;

  const n_workout_id = checkParamIsNum(workout_id);
  const n_exercise_id = checkParamIsNum(excerise_id);
  const n_order_in = checkParamIsNum(order_in);

  try {
    const result = await workoutService.createWorkoutExercise(
      n_workout_id,
      n_exercise_id,
      n_order_in
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
        .status(500)
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

export const updateWorkoutById = async (req, res) => {
  const { sub } = req.user;
  const { workout_id } = req.params;
  const { scheduled_date, is_completed } = req.body;

  const numerical_workout_id = Number(workout_id);
  if (isNaN(numerical_workout_id)) {
    return res.status(400).json({ error: "Invalid workout_id" });
  }

  const scheduled_date_val = scheduled_date ? new Date(scheduled_date) : null;
  const bool_is_completed =
    typeof is_completed !== "undefined" ? is_completed === "true" : null;

  try {
    const result = await workoutService.recastWorkoutById(
      bool_is_completed,
      scheduled_date_val,
      numerical_workout_id,
      sub
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Workout not found or nothing to update" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateWorkoutExercise = async (req, res) => {
  const { workout_exercise_id } = req.params;
  const { order_in, exercise_id } = req.body;

  const n_workout_exercise_id = checkParamIsNum(workout_exercise_id);
  const n_order_in = checkParamIsNum(order_in);
  const n_exercise_id = checkParamIsNum(exercise_id);

  try {
    const result = await workoutService.recastWorkoutExercise(
      n_order_in,
      n_exercise_id,
      n_workout_exercise_id
    );
    if (result.workout_exercise_id) {
      return res
        .status(500)
        .json({ error: "Unable to update the work exercise" });
    }
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateWorkoutExerciseSet = async (req, res) => {
  const { sub } = req.user;
  const { set_id } = req.params;
  const { weight, reps, comment } = req.body;

  console.log(req.body);

  try {
    const result = await workoutService.recastWorkoutExerciseSets(
      weight ?? null,
      reps ?? null,
      comment ?? null,
      sub,
      set_id
    );

    if (!result.set_id) {
      return res.status(404).json({ error: "Set not found or not updated" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
