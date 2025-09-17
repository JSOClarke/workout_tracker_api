import * as workoutService from "../services/workoutServices";
import * as workoutControllers from "../controllers/workoutControllers.js";

jest.mock("../services/workoutServices");

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
});

const controllerTest = ({
  controller,
  mockService,
  mockValue,
  expectedStatus,
  expectedJson,
  reqProps = {}, // can include query, params, body, user
  reject = false,
}) => {
  return async () => {
    if (mockService) {
      if (reject) {
        mockService.mockRejectedValue(mockValue);
      } else {
        mockService.mockResolvedValue(mockValue);
      }
    }

    const req = {
      user: { sub: 1 },
      query: {},
      params: {},
      body: {},
      ...reqProps,
    };

    const res = mockResponse();

    await controller(req, res);

    expect(res.status).toHaveBeenCalledWith(expectedStatus);
    if (expectedJson !== undefined)
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    if (expectedJson === undefined) expect(res.send).toHaveBeenCalled(); // if using send
  };
};

describe("Workout Controllers", () => {
  test(
    "testDBConnection returns 200 on success",
    controllerTest({
      controller: workoutControllers.testDBConnection,
      mockService: workoutService.testDb,
      mockValue: "OK",
      expectedStatus: 200,
      reqProps: {},
    })
  );

  test(
    "testDBConnection returns 500 on failure",
    controllerTest({
      controller: workoutControllers.testDBConnection,
      mockService: workoutService.testDb,
      mockValue: new Error("DB Fail"),
      expectedStatus: 500,
      expectedJson: { error: "DB Fail" },
      reject: true,
    })
  );

  test(
    "listWorkouts returns array when no query",
    controllerTest({
      controller: workoutControllers.listWorkouts,
      mockService: workoutService.gatherWorkouts,
      mockValue: [],
      expectedStatus: 200,
      expectedJson: [],
    })
  );

  test(
    "listWorkouts returns array when query is_completed",
    controllerTest({
      controller: workoutControllers.listWorkouts,
      mockService: workoutService.gatherWorkoutsByStatus,
      mockValue: [{ id: 1 }],
      expectedStatus: 200,
      expectedJson: [{ id: 1 }],
      reqProps: { query: { is_completed: "true" } },
    })
  );

  test(
    "listWorkoutExercises returns empty array if no data",
    controllerTest({
      controller: workoutControllers.listWorkoutExercises,
      mockService: workoutService.gatherWorkExercises,
      mockValue: [],
      expectedStatus: 200,
      expectedJson: [],
      reqProps: { params: { workout_id: 1 } },
    })
  );

  test(
    "listWorkoutExercises returns data",
    controllerTest({
      controller: workoutControllers.listWorkoutExercises,
      mockService: workoutService.gatherWorkExercises,
      mockValue: [
        {
          workout_id: 21,
          scheduled_date: "2025-09-15T09:00:00.000Z",
          order_in: 1,
          name: "Crunches",
          muscle_group: "Core",
          reps: null,
          weight: null,
          comment: null,
        },
      ],
      expectedStatus: 200,
      expectedJson: [
        {
          workout_id: 21,
          scheduled_date: "2025-09-15T09:00:00.000Z",
          order_in: 1,
          name: "Crunches",
          muscle_group: "Core",
          reps: null,
          weight: null,
          comment: null,
        },
      ],
      reqProps: { params: { workout_id: 1 } },
    })
  );

  test(
    "deleteWorkout returns 200 when deleted",
    controllerTest({
      controller: workoutControllers.deleteWorkout,
      mockService: workoutService.deleteWorkoutById,
      mockValue: [1, 2],
      expectedStatus: 200,
      reqProps: { query: { workout_id: 1 } },
    })
  );
  test(
    "deleteWorkout returns 404 when no content found",
    controllerTest({
      controller: workoutControllers.deleteWorkout,
      mockService: workoutService.deleteWorkoutById,
      mockValue: [],
      expectedStatus: 404,
      expectedJson: { error: "No content found" },
      reqProps: { query: { workout_id: 1 } },
    })
  );

  test(
    "deleteWorkout returns 500 on service error",
    controllerTest({
      controller: workoutControllers.deleteWorkout,
      mockService: workoutService.deleteWorkoutById,
      mockValue: new Error("Delete Fail"),
      expectedStatus: 500,
      expectedJson: { error: "Delete Fail" },
      reqProps: { query: { workout_id: 1 } },
      reject: true,
    })
  );

  test(
    "addWorkout returns 200 on success",
    controllerTest({
      controller: workoutControllers.addWorkout,
      mockService: workoutService.createWorkout,
      mockValue: [1],
      expectedStatus: 200,
      reqProps: { body: { scheduled_date: "2025-09-17" } },
    })
  );

  test(
    "addWorkout returns 500 on failure",
    controllerTest({
      controller: workoutControllers.addWorkout,
      mockService: workoutService.createWorkout,
      mockValue: new Error("Insert Fail"),
      expectedStatus: 500,
      expectedJson: { error: "Insert Fail" },
      reqProps: { body: { scheduled_date: "2025-09-17" } },
      reject: true,
    })
  );

  // --- addWorkoutExercises ---
  test(
    "addWorkoutExercises returns 200 on success",
    controllerTest({
      controller: workoutControllers.addWorkoutExercises,
      mockService: workoutService.createWorkoutExercise,
      mockValue: { workout_exercise_id: 1 },
      expectedStatus: 200,
      expectedJson: { workout_exercise_id: 1 },
      reqProps: { body: { workout_id: 1, excerise_id: 2, order_in: 1 } },
    })
  );

  test(
    "addWorkoutExercises returns 404 on failure",
    controllerTest({
      controller: workoutControllers.addWorkoutExercises,
      mockService: workoutService.createWorkoutExercise,
      mockValue: new Error("Insert Fail"),
      expectedStatus: 404,
      expectedJson: { error: "Insert Fail" },
      reqProps: { body: { workout_id: 1, excerise_id: 2, order_in: 1 } },
      reject: true,
    })
  );

  // --- addExerciseSets ---
  test(
    "addExerciseSets returns 200 on success",
    controllerTest({
      controller: workoutControllers.addExerciseSets,
      mockService: workoutService.createExerciseSet,
      mockValue: { set_id: 1 },
      expectedStatus: 200,
      expectedJson: { set_id: 1 },
      reqProps: {
        body: { workout_exercise_id: 1, reps: 10, weight: 50, comment: "" },
      },
    })
  );

  test(
    "addExerciseSets returns 404 on failure",
    controllerTest({
      controller: workoutControllers.addExerciseSets,
      mockService: workoutService.createExerciseSet,
      mockValue: new Error("Insert Fail"),
      expectedStatus: 404,
      expectedJson: { error: "Insert Fail" },
      reqProps: {
        body: { workout_exercise_id: 1, reps: 10, weight: 50, comment: "" },
      },
      reject: true,
    })
  );

  // --- deleteWorkoutExercise ---
  test(
    "deleteWorkoutExercise returns 200 on success",
    controllerTest({
      controller: workoutControllers.deleteWorkoutExercise,
      mockService: workoutService.deleteWorkoutExerciseById,
      mockValue: { workout_exercise_id: 1 },
      expectedStatus: 200,
      expectedJson: { workout_exercise_id: 1 },
      reqProps: { query: { workout_exercise_id: 1 } },
    })
  );

  test(
    "deleteWorkoutExercise returns 404 on failure",
    controllerTest({
      controller: workoutControllers.deleteWorkoutExercise,
      mockService: workoutService.deleteWorkoutExerciseById,
      mockValue: new Error("Delete Fail"),
      expectedStatus: 404,
      expectedJson: { error: "Delete Fail" },
      reqProps: { query: { workout_exercise_id: 1 } },
      reject: true,
    })
  );

  // --- listExerciseWithSets ---
  test(
    "listExerciseWithSets returns data",
    controllerTest({
      controller: workoutControllers.listExerciseWithSets,
      mockService: workoutService.gatherExerciseWithSets,
      mockValue: { workout_exercise_id: 1, name: "Squat" },
      expectedStatus: 200,
      expectedJson: { workout_exercise_id: 1, name: "Squat" },
      reqProps: { params: { workout_exercise_id: 1 } },
    })
  );

  test(
    "listExerciseWithSets returns empty array if no data",
    controllerTest({
      controller: workoutControllers.listExerciseWithSets,
      mockService: workoutService.gatherExerciseWithSets,
      mockValue: null,
      expectedStatus: 200,
      expectedJson: [],
      reqProps: { params: { workout_exercise_id: 1 } },
    })
  );

  test(
    "listExerciseWithSets returns 500 on error",
    controllerTest({
      controller: workoutControllers.listExerciseWithSets,
      mockService: workoutService.gatherExerciseWithSets,
      mockValue: new Error("Query Fail"),
      expectedStatus: 500,
      expectedJson: { error: "Query Fail" },
      reqProps: { params: { workout_exercise_id: 1 } },
      reject: true,
    })
  );
});
