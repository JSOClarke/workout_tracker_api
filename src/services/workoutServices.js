import pool from "../config/db.js";

export const testDb = async () => {
  const query = `SELECT 1`;
  const result = await pool.query(query);
  return result.rows[0];
};

export const gatherWorkouts = async (user_id) => {
  const query = `SELECT * FROM workouts WHERE user_id=$1`;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

export const gatherWorkoutsByStatus = async (user_id, boolean_is_completed) => {
  const query = `SELECT * FROM workouts WHERE user_id=$1 AND is_completed=$2`;
  const result = await pool.query(query, [user_id, boolean_is_completed]);
  return result.rows;
};

export const gatherWorkExercises = async (workout_id, user_id) => {
  const query = `SELECT
  w.workout_id,
  w.scheduled_date,
  json_agg(
    json_build_object(
      'name', e.name,
      'order_in', we.order_in,
	  'work_exercise_id', we.workout_exercise_id,
      'sets', (
        SELECT json_agg(json_build_object('reps', s.reps, 'weight', s.weight, 'set_id' ,s.set_id))
        FROM sets s
        WHERE s.workout_exercise_id = we.workout_exercise_id
      )
    )
  ) AS exercises
FROM workouts w
JOIN workout_exercises we ON w.workout_id = we.workout_id
JOIN exercises e ON we.exercise_id = e.exercise_id
WHERE w.workout_id = $1
  AND w.user_id = $2
GROUP BY w.workout_id, w.scheduled_date`;

  const result = await pool.query(query, [workout_id, user_id]);
  return result.rows;
};

export const deleteWorkoutById = async (workout_id, user_id) => {
  const query = `DELETE FROM workouts WHERE workout_id=$1 AND user_id=$2 RETURNING workout_id`;
  const result = await pool.query(query, [workout_id, user_id]);
  return result.result[0];
};

export const deleteWorkoutExerciseById = async (workout_exercise_id) => {
  const query =
    "DELETE FROM workout_exercises WHERE workout_exercise_id = $1 RETURNING workout_exercise_id";
  const result = await pool.query(query, [workout_exercise_id]);
  return result.rows[0];
};

export const createWorkout = async (user_id, scheduled_date) => {
  const query = `INSERT INTO workouts (user_id,scheduled_date) VALUES ($1,$2) RETURNING workout_id`;
  const result = await pool.query(query, [user_id, scheduled_date]);
  return result.rows[0];
};

export const createWorkoutExercise = async (
  workout_id,
  exercise_id,
  order_in
) => {
  const query = `INSERT INTO workout_exercises (workout_id,exercise_id,order_in) VALUES ($1,$2,$3) RETURNING *`;
  const result = await pool.query(query, [workout_id, exercise_id, order_in]);
  return result.rows[0];
};

export const createExerciseSet = async (
  workout_exercise_id,
  reps,
  weight,
  comment = ""
) => {
  const query = `INSERT INTO sets (workout_exercise_id,
      reps,
      weight,
      comment) VALUES ($1,$2,$3,$4) RETURNING *`;
  const result = await pool.query(query, [
    workout_exercise_id,
    reps,
    weight,
    comment,
  ]);
  return result.rows[0];
};

export const gatherExerciseWithSets = async (user_id, workout_exercise_id) => {
  const query = `SELECT w.workout_id,w.scheduled_date,we.order_in,e.name,e.muscle_group,s.reps,s.weight,s.comment FROM workouts w 
JOIN workout_exercises we ON w.workout_id = we.workout_id 
JOIN exercises e ON e.exercise_id = we.exercise_id 
LEFT JOIN sets s ON s.workout_exercise_id = we.exercise_id
WHERE user_id=$1 AND we.workout_exercise_id=$2`;

  const result = await pool.query(query, [user_id, workout_exercise_id]);
  return result.rows[0];
};

export const recastWorkoutById = async (
  is_completed = null,
  scheduled_date = null,
  workout_id,
  user_id
) => {
  console.log(`workout_id,  ${workout_id}, type ${typeof workout_id}`);

  console.log(
    `scheduled_date,${scheduled_date}, type ${typeof scheduled_date}`
  );
  console.log(`is_completed, ${is_completed}, type ${typeof is_completed}`);

  const query = `
    UPDATE workouts
    SET 
      is_completed = COALESCE($1, is_completed),
      scheduled_date = COALESCE($2, scheduled_date)
    WHERE workout_id = $3 AND user_id = $4
    RETURNING *`;
  const result = await pool.query(query, [
    is_completed,
    scheduled_date,
    workout_id,
    user_id,
  ]);

  return result;
};

export const recastWorkoutExercise = async (
  order_in,
  exercise_id,
  workout_exercise_id
) => {
  const query = `UPDATE workout_exercises SET order_in = COALESCE($1,order_in) SET exercise_id=COALESCE($2,exercise_id) WHERE workout_exercise_id=$3 RETURNING workout_exercise_id`;
  const result = await pool.query(query, [
    order_in,
    exercise_id,
    workout_exercise_id,
  ]);
  return result.rows[0];
};

export const recastWorkoutExerciseSets = async (
  weight = null,
  reps = null,
  comment = null,
  user_id,
  set_id
) => {
  const query = `
UPDATE sets s
SET 
weight = COALESCE($1, weight),
reps = COALESCE($2, reps),
comment = COALESCE($3, comment)
FROM workout_exercises we
JOIN workouts w ON w.workout_id = we.workout_id
WHERE s.workout_exercise_id = we.workout_exercise_id
AND w.user_id=$4
AND s.set_id = $5
RETURNING s.set_id;`;

  const result = await pool.query(query, [
    weight,
    reps,
    comment,
    user_id,
    set_id,
  ]);

  console.log("result", result);

  return result.rows[0];
};
