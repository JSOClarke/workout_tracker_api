import * as workoutService from "../services/workoutServices.js";
// Makes sense to use the query paramters for the lists eg list?status=pending

export const listWorkouts = async (req, res) => {
  try {
    const result = await workoutService.gatherWorkouts(); // returns the rows so should be a array of objects i believe
    if (result.length === 0 || !result) {
      return res
        .status(400)
        .json({ error: "Not able to find any data from database" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
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

export const listWorkoutsByStatus = async (req, res) => {
  const { is_completed } = req.query;

  const boolean_is_completed = is_completed === "true" ? true : false;
  try {
    const result = await workoutService.gatherWorkoutsByStatus(
      process.env.USER_ID,
      boolean_is_completed
    );
    if (result.length === 0) {
      return res
        .status(200)
        .json({ data: "No workout found with that criteria" });
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

export const addWorkout = async (req, res) => {
  const { scheduled_date } = req.body;

  try {
    const result = await workoutService.createWorkout(
      process.env.USER_ID,
      scheduled_date
    );
    if (result.rowCount == 0) {
      return res.status(400).send("DB couldnt insert the workout");
    }
    res
      .status(200)
      .send("Sucesfully added the workout send back the ID next time tho");
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
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
    if (result.rowCount == 0) {
      return res
        .status(400)
        .send("DB not able to create work exercise query but no error");
    }
    res
      .status(200)
      .send("Sucesfully added the exercise send back the ID next time tho");
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
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
    if (result.rowCount == 0) {
      return res
        .status(400)
        .send("DB not able to create set query but no error");
    }
    res
      .status(200)
      .send("Sucesfully added the  set send back the ID next time tho");
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

const generateReport = async (req, res) => {};
