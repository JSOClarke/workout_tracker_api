import pool from "../config/db.js";

export const createSignup = async (name, email, password_hash) => {
  const query = `INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3) RETURNING user_id,email`;
  const result = await pool.query(query, [name, email, password_hash]);
  return result.rows[0];
};

export const getUser = async (email) => {
  const query = `SELECT * FROM users WHERE email=$1`;
  const result = await pool.query(query, [email]);
  console.log(result);
  return result.rows[0];
};
