import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './utils/db.js';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser'; 
import courseRoutes from "./routes/courseRoutes.js"; 


const app = express();
dotenv.config();  

const port = process.env.PORT || 5000;
ConnectDB();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5713', 'http://localhost:5173'],  
    credentials: true,  
  })
);
app.use(express.json());  

// API Routes
app.use('/api/auth', authRoute);
app.use("/api/courses", courseRoutes);  

// Root Route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Skilify!</h1>');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});