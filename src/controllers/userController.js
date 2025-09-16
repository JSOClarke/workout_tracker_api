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

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    // gives you a random string
    console.log(salt);
    const password_hash = await bcrypt.hash(password, salt);

    console.log(password_hash);
    // res.status(200).json({ message: "Succesfully salted and hashed" });

    const result = await userServices.createSignup(name, email, password_hash);
    console.log("result", result);

    if (res.length === 0) {
      return res
        .status(200)
        .json({ message: "No DB error but user not inserted" });
    }

    const token = createJWT(result.user_id, result.email);

    res.status(200).json({ jwt: token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userServices.getUser(email);
    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "No user found with the provided email address" });
    }
    console.log("result", result);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      result.password_hash
    );
    console.log("isPasswordCorrect", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid password" });
    }
    const token = createJWT(result.user_id, result.email);
    res.status(200).json({ jwt: token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
