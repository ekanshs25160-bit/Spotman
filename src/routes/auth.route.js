import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import passport from "passport";

const router = Router();

router.route("/register").post(registerUser);
router.post("/login", passport.authenticate("local"), (req, res) => {
  return res.status(200).json({
    message: "Logged in successfully",
    user: req.user,
  });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
