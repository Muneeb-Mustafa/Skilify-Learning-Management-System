import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userSchema.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import leadsModel from "../models/leadsSchema.js"; 
import bcrypt from 'bcryptjs'
import Enrollment from "../models/Enrollment.js";
dotenv.config()

// Register
export const register = async(req, res)=>{
    try {
        const {name, email, password, role} = req.body;
        if(!name || !email || !password ){
            return res.status(400).json({error: "All fields are required"})
        }
        const existingUser = await userModel.findOne({email})
        if(existingUser) return res.status(400).json({error: "Email already exists"})
        const hashedPassword = await hashPassword(password);
        const user = new userModel({name, email, password: hashedPassword, role});
        await user.save()
        res.status(200).json({success : true, message: "User registered successfully", user})
    } catch (error) {
        console.log(error)
        res.status(500).send({success : false, message: "Internal Server error"})
    }
}

// Login
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ success: false, error: "Invalid email or password" });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({ success: false, msg: "User not found" });
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ success: false, msg: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.Secret_Key, { expiresIn: "1d" });
      res.cookie('token', token, {
        httpOnly: true,  
        secure: false,   
        maxAge: 3 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
    });
    res.status(200).json({success: true, msg: "User Logged in successfully", data: {user, token}}) 
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Internal Server error" });
    }
  };

  export const enrollCourse = async (req, res) => {
    const { email, paymentMethod, saveInformation } = req.body;
    const { courseId } = req.params;
  
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const enrollment = new Enrollment({
        email,
        paymentMethod,
        saveInformation,
        courseId
      });
  
      await enrollment.save();
      res.status(201).json({ message: 'Enrollment successful', enrollment });
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
  };
export  const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, msg: "Logged out successfully" });
};

// Me 
export const Me = async (req, res) => {
  try {
    const token = req.cookies.token; // Ensure cookies are parsed correctly
    
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.Secret_Key); // Ensure `Secret_Key` is correct

    // Fetch user details
    const user = await userModel.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in /me route: ", error.message); // Log detailed error
    res.status(500).json({ msg: "Server Error" });
  }
};
 
// Caputure Leads Function for Home form
export const leads = async(req, res)=>{
  try {
      const {name, emails, messages } = req.body;
      if(!name || !emails ||!messages ){
          return res.status(400).json({error: "All fields are required"})
      }    
      const leads = new leadsModel({name, emails, messages});
      await leads.save()
      res.status(200).json({success : true, message: "Message has been sent successfully", leads})
  } catch (error) {
      console.log(error)
      res.status(500).send({success : false, message: "Internal Server error"})
  }
}
  export const admin = async(req, res)=>{
    try {
      return res.status(200).send({ success: true, message: "Welcome, Admin!" });
    } catch (error) {
      return res.status(500).send({ success: false, message: "Internal Server error" });
    }
  }

  export const student = async(req, res)=>{
    try {
      return res.status(200).send({ success: true, message: "Welcome, Student!" });
    } catch (error) {
      return res.status(500).send({ success: false, message: "Internal Server error" });
    }
  }

  export const Instructor = async(req, res)=>{
    try {
      return res.status(200).send({ success: true, message: "Welcome, Instructor!" });
    } catch (error) {
      return res.status(500).send({ success: false, message: "Internal Server error" });
    }}

    
// Forgot Password - Generate Token & Send Email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.Secret_Key, { expiresIn: "1h" });

    // Set token expiration in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // ✅ Correct variable
      },
    });
    

    // Email Content
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}" target="_blank">${resetLink}</a>
             <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(decoded.id);

    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); 
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update User Role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ success: false, message: "User ID and role are required" });
    }

    const validRoles = ["user", "instructor", "admin"]; // Define valid roles
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return updated document
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
