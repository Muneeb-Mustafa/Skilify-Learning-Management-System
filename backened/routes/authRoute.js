import express from "express";
import { register, login, admin, student, Instructor, logout,  forgotPassword, resetPassword } from "../controller/authController.js";
import { profileStorage } from "../config/cloudinary.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: profileStorage });


router.post("/register", register);
router.post("/login", login);
router.post('/logout', logout); 

// Forgot Password
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword);


export default router;
