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

export const listWorkoutExercises = async (req, res) => {
  let response = [];
  const query = `SELECT exercise_id FROM workout_exercises WHERE workout_id=$1`;
  try {
    const result = await pool.query(query, [process.env.WORKOUT_ID]);
    if (result.rowCount === 0) {
      throw new Error("No exercise found");
    }
    for (let i = 0; i < result.rowCount; i++) {
      const ex = await findExercise(result.rows[i].exercise_id);

      response.push(ex);
    }

    return response;
  } catch (err) {
    return err;
  }
  // RETURNING THE exercise ID which we will then do a search for
  // so we need to fist take in the workout_id.
};

export const findExercise = async (exercise_id) => {
  const query = `SELECT * FROM exercises WHERE exercise_id=$1`;
  try {
    const result = await pool.query(query, [exercise_id]);
    return result.rows;
  } catch (err) {
    return err;
  }
};
