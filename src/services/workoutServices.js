import pool from "../config/db.js";

export const gatherWorkouts = async (req, res) => {
  try {
    const query = `SELECT * FROM workouts WHERE user_id=$1`;
    const result = await pool.query(query, [process.env.USER_ID]);
    return result.rows;
  } catch (err) {
    return err;
  }
};

export const gatherWorkExercises = async (workout_id) => {
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

  const result = await pool.query(query, [workout_id]);
  return result.rows;
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

export const deleteWorkoutById = async (workout_id) => {
  const query = `DELETE FROM workouts WHERE workout_id=$1`;
  const result = await pool.query(query, [workout_id]);
  return result;
};

// export const findSets = async () => {
//   const query = `SELECT * from sets WHERE`;
// };
