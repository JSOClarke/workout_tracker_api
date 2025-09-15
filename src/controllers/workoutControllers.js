import { listExercises, listWorkouts } from "../services/workoutServices.js";
// Makes sense to use the query paramters for the lists eg list?status=pending

export const testWorkouts = async (req, res) => {
  try {
    const result = await listWorkouts(); // returns the rows so should be a array of objects i believe
    console.log("result", result);
    if (result.length === 0 || !result) {
      return res
        .status(400)
        .json({ error: "Not able to find any data from database" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Database error" });
  }
};

export const testExercises = async (req, res) => {
  try {
    const response = await listExercises();
    if (result.length === 0 || !result) {
      return res
        .status(400)
        .json({ error: "Not able to find any data from database" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "No exercises found" });
  }
};
