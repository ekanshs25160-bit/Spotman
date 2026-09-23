import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/db/index.js";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!", err);
  });