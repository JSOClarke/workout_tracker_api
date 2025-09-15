import pool from "../config/db.js";

export const listWorkouts = async (req, res) => {
  try {
    const query = `SELECT * FROM workouts WHERE user_id=$1`;
    const result = await pool.query(query, [process.env.USER_ID]);
    return result.rows;
  } catch (err) {
    return err;
  }
};

export const listExercises = async (req, res) => {
  const excercise_id = `SELECT * FROM workout_exercises WHERE user_id=$1 AND workout_id=$2 RETURNING exercise_id`;
  const query = `SELECT * FROM exercise WHERE user_id=$1 AND exercise_id=$2`;

  try {
    const ex_id = await pool.query(excercise_id, [USER_ID, WORKOUT_ID]);
    if (!ex_id) {
      throw new Error("No Workout Exercises found for the given workout ID");
    }
    const result = await pool.query(query, [USER_ID, ex_id]);
    return result.rows;
  } catch (err) {
    return err;
  }
  // RETURNING THE exercise ID which we will then do a search for
  // so we need to fist take in the workout_id.
};
