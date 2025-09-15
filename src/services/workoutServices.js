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
  //   let response = [];
  const query = `SELECT 
  w.workout_id,
  w.scheduled_date,
  e.name AS exercise_name,
  s.reps,
  s.weight,
  we.order_in
FROM workouts w
JOIN workout_exercises we ON w.workout_id = we.workout_id
JOIN sets s ON we.workout_exercise_id = s.workout_exercise_id
JOIN exercises e ON we.exercise_id = e.exercise_id
WHERE w.workout_id = $1`;
  try {
    const result = await pool.query(query, [process.env.WORKOUT_ID]);
    if (result.rowCount === 0) {
      throw new Error("No exercise found");
    }
    // for (let i = 0; i < result.rowCount; i++) {
    //   const ex = await findExercise(result.rows[i].exercise_id);

    //   response.push(ex);
    // }

    return result.rows;
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

export const deleteWorkout = async (req, res) => {
  const { workout_id } = req.query;
  if (!workout_id) {
    throw new Error("The passed wuery parameter is undefined");
  }

  const query = `DELETE FROM workout WHERE workout_id=$1`;
  try {
    const result = await pool.query(query, [workout_id]);
    return result.rows;
  } catch (err) {
    return err;
  }
};

export const findSets = async () => {
  const query = `SELECT * from sets WHERE`;
};
