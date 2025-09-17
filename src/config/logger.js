import winston from "winston";

// Create a logger
const logger = winston.createLogger({
  level: "info", // default logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // structured JSON logs
  ),
  transports: [
    new winston.transports.Console(), // prints to console
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
