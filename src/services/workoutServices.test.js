import { gatherWorkouts } from "./workoutServices.js";
import pool from "../config/db.js";

jest.mock("../config/db.js"); // mock pool

test("returns workouts for a user", async () => {
  pool.query.mockResolvedValue({
    rows: [{ workout_id: 1, name: "Pushups" }],
  });

  const result = await gatherWorkouts(123);
  expect(result).toEqual([{ workout_id: 1, name: "Pushups" }]);
  expect(pool.query).toHaveBeenCalledWith(
    "SELECT * FROM workouts WHERE user_id=$1",
    [123]
  );
});
