import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userServices from "../services/userServices.js";

const createJWT = (user_id, email) => {
  return jwt.sign({ sub: user_id, email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Sing

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return await bcrypt.hash(password, salt);
};

export const isPasswordCorrect = async (hashed_password, plain_password) => {
  return await bcrypt.compare(plain_password, hashed_password);
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "No name,email or password provided" });
  }

  try {
    const password_hash = await hashPassword(password);

    const result = await userServices.createSignup(name, email, password_hash);

    if (!result || !result.user_id) {
      return res
        .status(500)
        .json({ error: "User has not been added to email" });
    }

    const token = createJWT(result.user_id, result.email);

    res.status(200).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ error: "No email or Password provided" });
  }

  try {
    const result = await userServices.getUser(email);
    if (!result || !result.user_id) {
      return res.status(500).json({ error: "No user returned from database" });
    }

    const isMatch = await bcrypt.compare(password, result.password_hash);

    if (!isMatch) {
      return res.status(500).json({ message: "Invalid password" });
    }
    const token = createJWT(result.user_id, result.email);
    res.status(200).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
