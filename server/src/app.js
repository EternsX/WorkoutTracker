import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import './config/db.js'; // Ensure DB is initialized
import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from './routes/workouts.routes.js'
import exerciseRoutes from './routes/exercises.routes.js'
import setsRoutes from './routes/set.routes.js'
import sessionRoutes from './routes/session.routes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'


const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://workouttracker-qguj.onrender.com', 'http://192.168.178.31:5173', 'https://eternsx.github.io', 'https://eternsx.github.io/WorkoutTracker'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true // cookies
}));


app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/session", sessionRoutes);
app.use("/workouts/:workoutId/exercises", exerciseRoutes);
app.use("/workouts/:workoutId/exercises/:exerciseId/sets", setsRoutes);
app.use(errorMiddleware);

export default app;