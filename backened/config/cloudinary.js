import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); 

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
}); 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'courses',
    allowed_formats: ['jpg', 'png', 'mp4']
  }
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures",
    allowed_formats: ["jpg", "png"],
  },
});



export  { cloudinary, storage, profileStorage };
