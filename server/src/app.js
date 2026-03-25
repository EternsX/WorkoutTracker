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
const allowedOrigins = [
  'http://localhost:5173', // dev
  'https://workouttracker-qguj.onrender.com' // prod frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like curl or Postman
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  credentials: true
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