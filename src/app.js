import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

import pool from "./config/db.js";
const PORT = 4000;

const app = express();

app.get("/bkhealth", async (req, res) => {
  res
    .status(200)
    .json({ health: "All good, server is running and connection is open" });
});

app.get("/dbhealth", async (req, res) => {
  const query = `SELECT 1`;
  try {
    const result = await pool.query(query);
    res.status(200).send("Succesfully connection");
  } catch (err) {
    console.error(err);
    res.status(400).send("Data-base issue");
  }
  console.log();
});

app.listen(PORT, () => console.log("Server is up on PORT: ", PORT));
