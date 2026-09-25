import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res.status(400).json({ error: "User is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    username: username,
  });

  return res.status(201).json({
    message: "User is registered",
    user: {
      _id: user._id,
      email: user.email,
      username: username,
    },
  });
};
