import userModel from "../models/userSchema.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try { 
  
      const { name, bio, socialLinks } = req.body;
      const userId = req.user.id;
      let updateData = { name, bio, socialLinks };
  
      if (req.file) {
        updateData.profilePicture = req.file.path; // Cloudinary URL 
      } else {
        console.log("No file uploaded");
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");
  
      res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  