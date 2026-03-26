import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Dashboard from "./components/DashBoard/DashBoard";
import Exercises from "./components/Exercises/Exercises";

import WorkoutHistory from "./components/WorkoutHistory/WorkoutHistory"; // import your component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* "/" shows Dashboard */}
        <Route index element={<Dashboard />} />

        {/* "/workouts/:workoutId" */}
        <Route path="workouts/:workoutId" element={<Exercises />} />

        {/* "/history" route */}
        <Route path="history" element={<WorkoutHistory />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;