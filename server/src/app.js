import express from 'express';
import cors from 'cors';
import './config/db.js'; // Ensure DB is initialized
import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from './routes/workouts.routes.js'
import exerciseRoutes from './routes/exercises.routes.js'
import setsRoutes from './routes/set.routes.js'
import sessionRoutes from './routes/session.routes.js'
import historyRoutes from './routes/history.routes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'


const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.178.31:5173',
  'https://workouttracker-qguj.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin ${origin}`));
    }
  },
  methods: ['GET','POST','PUT','DELETE','PATCH']
}));


app.use(express.json());
app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/session", sessionRoutes);
app.use("/workouts/:workoutId/exercises", exerciseRoutes);
app.use("/workouts/:workoutId/exercises/:exerciseId/sets", setsRoutes);
app.use("/history", historyRoutes);
app.use(errorMiddleware);

export default app;