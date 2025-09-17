import * as workoutServices from "./workoutServices.js";
import pool from "../config/db.js";

jest.mock("../config/db.js"); // mock pool

test("returns workouts for a user", async () => {
  pool.query.mockResolvedValue({
    rows: [
      {
        workout_id: 21,
        user_id: 8,
        scheduled_date: "2025-09-15T09:00:00.000Z",
        is_completed: false,
      },
    ],
  });

  const result = await workoutServices.gatherWorkouts(123);
  expect(result).toEqual([
    {
      workout_id: 21,
      user_id: 8,
      scheduled_date: "2025-09-15T09:00:00.000Z",
      is_completed: false,
    },
  ]);
  expect(pool.query).toHaveBeenCalledWith(
    "SELECT * FROM workouts WHERE user_id=$1",
    [123]
  );

  // const result2 = await workoutServices.gatherWorkoutsByStatus(123);
  // expect(result2).toEqual([]);
});
