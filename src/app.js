import express from "express";
// import healthRoutes from "./routes/healthRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use("/", workoutRoutes, express.json());

app.listen(process.env.PORT, () =>
  console.log("Server is up on PORT: ", process.env.PORT)
);
