import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Dashboard from "./pages/DashBoard/Dashboard";
import Exercises from "./components/Exercises/Exercises";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* "/" shows Dashboard */}
        <Route index element={<Dashboard />} />

        {/* "/workouts/:workoutId" */}
        <Route path="workouts/:workoutId" element={<Exercises />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;