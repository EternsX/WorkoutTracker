// src/pages/Progress/Progress.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import useWorkout from "../../context/Workouts/useWorkout";
import useExercise from "../../context/Exercises/useExercise";
import useProgress from "../../context/Progress/useProgress";
import "./Progress.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const { workouts } = useWorkout();
  const { getExercises } = useExercise();
  const { getBestSet } = useProgress();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedWorkout = searchParams.get("workout") || "";
  const selectedExercise = searchParams.get("exercise") || "";

  const [exercises, setExercises] = useState([]);
  const [progressData, setProgressData] = useState([]);

  // Load exercises when workout changes
  useEffect(() => {
    if (!selectedWorkout) return;

    const loadExercises = async () => {
      const result = await getExercises(selectedWorkout);

      const exercisesArray = result?.exercises || [];

      setExercises(exercisesArray);

      if (!exercisesArray.find((e) => e.workout_exercise_id === selectedExercise)) {
        setSearchParams({ workout: selectedWorkout });
      }
    };
    loadExercises();
  }, [selectedWorkout, selectedExercise, getExercises, setSearchParams]);

  // Load progress when exercise changes
  useEffect(() => {
    if (!selectedExercise) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgressData([]);
      return;
    }

    const loadProgress = async () => {
      const result = await getBestSet(selectedExercise);
      setProgressData(result.bestSet?.progress || []);
    };

    loadProgress();
  }, [selectedExercise, getBestSet]);

  // Chart data
  const chartData = {
    labels: progressData.map((p) => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: "Best Set Reps",
        data: progressData.map((p) => p.best_set),
        borderColor: "rgba(0, 255, 200, 1)",
        backgroundColor: "rgba(0, 255, 200, 0.2)",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" }, onClick: null },
      tooltip: {
        mode: "index",
        intersect: false,
        titleColor: "#000",
        bodyColor: "#000",
        backgroundColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      x: {
        type: "category",
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="progress-page">
      <h1>Progress Tracker</h1>

      {/* Selectors container */}
      <div className="selectors-container">
        <div className="selector-card">
          <label>Workout:</label>
          <select
            value={selectedWorkout}
            onChange={(e) => setSearchParams({ workout: e.target.value })}
          >
            <option value="">Select Workout</option>
            {workouts.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {exercises.length > 0 && (
          <div className="selector-card">
            <label>Exercise:</label>
            <select
              value={selectedExercise}
              onChange={(e) =>
                setSearchParams({
                  workout: selectedWorkout,
                  exercise: e.target.value,
                })
              }
            >
              <option value="">Select Exercise</option>
              {exercises.map((ex) => (
                <option
                  key={ex.workout_exercise_id}
                  value={ex.workout_exercise_id}
                >
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <hr className="divider" />

      {/* Chart container */}
      <div className="chart-card">
        {progressData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="no-data">No progress data for this exercise.</p>
        )}
      </div>
    </div>
  );
}