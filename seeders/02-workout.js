import dotenv from "dotenv";

dotenv.config();
import * as workoutServices from "../src/services/workoutServices.js";

const date = "2025-09-15T10:00:00";

// const workout = { user_id: 2, scheduled_date: date };
// const workout_exercises = { workout_id };

const workoutSeeder = async () => {
  //   const delete_q = `TRUNCATE workout RESTART IDENTITY CASCADE`;
  //   await pool.query(delete_q);
  //
  // Seed the database with some workouts

  const createWorkoutResult = await workoutServices.createWorkout(
    process.env.USER_ID,
    date
  );
  console.log("workout_id", createWorkoutResult.workout_id);
  const createWorkoutExercise = await workoutServices.createWorkoutExercise(
    createWorkoutResult.workout_id,
    10,
    1
  );
  console.log("workout_exercise_id", createWorkoutExercise.workout_exercise_id);
  await workoutServices.createExerciseSet(
    createWorkoutExercise.workout_exercise_id,
    10,
    50,
    "texty"
  );
};

const addSetAndExercise = async (
  user_id,
  exercise_id,
  reps,
  weight,
  comment,
  order_in,
  number_of_sets
) => {
  const createWorkoutResult = await workoutServices.createWorkout(
    user_id,
    date
  );
  console.log("workout_id", createWorkoutResult.workout_id);
  const createWorkoutExercise = await workoutServices.createWorkoutExercise(
    createWorkoutResult.workout_id,
    exercise_id,
    order_in
  );
  console.log("workout_exercise_id", createWorkoutExercise.workout_exercise_id);
  for (let i = 0; i < number_of_sets; i++) {
    console.log(i + 1);
    await workoutServices.createExerciseSet(
      createWorkoutExercise.workout_exercise_id,
      reps,
      weight,
      comment
    );
  }
};

await workoutSeeder();

await addSetAndExercise(process.env.USER_ID, 17, 10, 50, "maybe dont", 10, 5);
process.exit();
