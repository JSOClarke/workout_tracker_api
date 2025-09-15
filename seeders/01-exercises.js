import pool from "../src/config/db.js";

const exercises = [
  { name: "Bench Press", muscle_group: "Chest" },
  { name: "Squat", muscle_group: "Legs" },
  { name: "Pull-Up", muscle_group: "Back" },
  { name: "Overhead Press", muscle_group: "Shoulders" },
  { name: "Barbell Row", muscle_group: "Back" },
  { name: "Deadlift", muscle_group: "Legs" },
  { name: "Incline Dumbbell Press", muscle_group: "Chest" },
  { name: "Leg Press", muscle_group: "Legs" },
  { name: "Lat Pulldown", muscle_group: "Back" },
  { name: "Arnold Press", muscle_group: "Shoulders" },
  { name: "Dumbbell Fly", muscle_group: "Chest" },
  { name: "Leg Curl", muscle_group: "Legs" },
  { name: "Face Pull", muscle_group: "Shoulders" },
  { name: "Bicep Curl", muscle_group: "Arms" },
  { name: "Tricep Pushdown", muscle_group: "Arms" },
  { name: "Calf Raise", muscle_group: "Legs" },
  { name: "Plank", muscle_group: "Core" },
  { name: "Russian Twist", muscle_group: "Core" },
  { name: "Crunches", muscle_group: "Core" },
  { name: "Lateral Raise", muscle_group: "Shoulders" },
  { name: "Front Raise", muscle_group: "Shoulders" },
  { name: "Shrugs", muscle_group: "Shoulders" },
  { name: "Good Mornings", muscle_group: "Back" },
  { name: "T-Bar Row", muscle_group: "Back" },
  { name: "Cable Row", muscle_group: "Back" },
  { name: "Chin-Up", muscle_group: "Back" },
  { name: "Handstand Push-Up", muscle_group: "Shoulders" },
  { name: "Pistol Squat", muscle_group: "Legs" },
  { name: "Lunge", muscle_group: "Legs" },
  { name: "Goblet Squat", muscle_group: "Legs" },
  { name: "Hack Squat", muscle_group: "Legs" },
  { name: "Romanian Deadlift", muscle_group: "Legs" },
  { name: "Glute Bridge", muscle_group: "Legs" },
  { name: "Hyperextension", muscle_group: "Back" },
  { name: "Dips", muscle_group: "Chest" },
  { name: "Close-Grip Bench Press", muscle_group: "Arms" },
  { name: "Skullcrusher", muscle_group: "Arms" },
  { name: "Hammer Curl", muscle_group: "Arms" },
  { name: "Reverse Bicep Curl", muscle_group: "Arms" },
  { name: "Preacher Curl", muscle_group: "Arms" },
  { name: "Concentration Curl", muscle_group: "Arms" },
  { name: "Rope Pushdown", muscle_group: "Arms" },
  { name: "Sit-Ups", muscle_group: "Core" },
  { name: "Leg Raises", muscle_group: "Core" },
  { name: "Hanging Leg Raise", muscle_group: "Core" },
  { name: "Mountain Climbers", muscle_group: "Core" },
  { name: "Side Plank", muscle_group: "Core" },
  { name: "Kettlebell Swing", muscle_group: "Legs" },
  { name: "Box Jump", muscle_group: "Legs" },
  { name: "Thruster", muscle_group: "Shoulders" },
];

const excerciseSeed = async (req, res) => {
  // Delete all previous excersise entries
  const delte_query = `TRUNCATE exercises RESTART IDENTITY CASCADE`;

  await pool.query(delte_query);
  console.log("Deleted succesfully");

  // loop through all of the exercises and then for each do a query to insert into the database

  for (const ex of exercises) {
    const query = `INSERT INTO exercises (name,muscle_group) VALUES ($1,$2)`;

    await pool.query(query, [ex.name, ex.muscle_group]);
    console.log("Succesfully entry");
  }

  console.log("All exercises have been seeded");
};

await excerciseSeed();
process.exit();
