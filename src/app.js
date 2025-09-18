import express from "express";
import workoutRoutes from "./routes/workoutRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/auth.js";
import logger from "./config/logger.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerSpec = YAML.load("./openapi.yaml");

// // Wrap authMiddleware with unless to exclude login/signup
// authMiddleware.unless = unless;
// const protectedMiddleware = authMiddleware.unless({
//   path: ["/users/login", "/users/signup"],
// });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);

app.use("/workouts", authMiddleware, workoutRoutes);

// app.use("/", workoutRoutes);

app.listen(process.env.PORT, () =>
  logger.info("Server is up on PORT:", process.env.PORT)
);

export default app;
