import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Dashboard from "./pages/DashBoard/Dashboard";
import WorkoutDetails from "./pages/WorkoutDetails/WorkoutDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* "/" shows Dashboard */}
        <Route index element={<Dashboard />} />

        {/* "/workouts/:workoutId" */}
        <Route path="workouts/:workoutId" element={<WorkoutDetails />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;