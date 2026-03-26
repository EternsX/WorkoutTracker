import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useHistory from "../../context/History/useHistory";
import useWorkout from "../../context/Workouts/useWorkout";
import "./WorkoutHistory.css";

export default function WorkoutHistory() {
  const { history, getHistory } = useHistory();
  const { getWorkout } = useWorkout();

  const [calendar, setCalendar] = useState({});

  // 🔥 URL state
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const now = new Date();

  // 🔹 Safe parsing of URL params
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  const month = monthParam !== null ? Number(monthParam) : now.getMonth();
  const year = yearParam !== null ? Number(yearParam) : now.getFullYear();


  // 🔹 Fetch history
  useEffect(() => {
    getHistory();
  }, [getHistory]);

  // 🔹 Build calendar map (LOCAL TIME)
  useEffect(() => {
    if (!history) return;

    const cal = {};

    history.forEach((session) => {
      const localDate = new Date(session.completed_at);
      // ISO-like date string in local timezone: YYYY-MM-DD
      const dateKey = localDate.toLocaleDateString("sv-SE");

      if (!cal[dateKey]) cal[dateKey] = [];
      cal[dateKey].push(session);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalendar(cal);
  }, [history]);

  // 🔥 Update URL
  const updateURL = (newMonth, newYear) => {
    navigate(`/history?month=${newMonth}&year=${newYear}`, {
      replace: true,
    });
  };

  // 🔹 Navigation
  const prevMonth = () => {
    if (month === 0) {
      updateURL(11, year - 1);
    } else {
      updateURL(month - 1, year);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      updateURL(0, year + 1);
    } else {
      updateURL(month + 1, year);
    }
  };

  // 🔹 Calendar calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null); // empty slots
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  // 🔹 Dynamic year range
  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - 5 + i);

  return (
    <div className="history-container">

      {/* 🔥 Header / Navigation */}
      <div className="calendar-nav">
        <button onClick={prevMonth}>←</button>

        <select
          value={month}
          onChange={(e) => updateURL(Number(e.target.value), year)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("de-DE", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => updateURL(month, Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={nextMonth}>→</button>

        <button
          onClick={() => {
            const now = new Date();
            updateURL(now.getMonth(), now.getFullYear());
          }}
        >
          Today
        </button>
      </div>

      {/* 🔹 Calendar Grid */}
      <div className="calendar-grid">
        {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].map((d) => (
          <div key={d} className="calendar-header">{d}</div>
        ))}

        {calendarDays.map((date, idx) => {
          if (!date)
            return <div key={idx} className="calendar-cell empty"></div>;

          const dateKey = date.toLocaleDateString("sv-SE");
          const sessions = calendar[dateKey] || [];

          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`calendar-cell 
                ${sessions.length ? "active" : ""} 
                ${isToday ? "today" : ""}`}
            >
              <span className="day-number">{date.getDate()}</span>

              {sessions.map((s) => {
                const workout = getWorkout(s.workout_id);
                const time = new Date(s.completed_at).toLocaleTimeString(
                  "de-DE",
                  { hour: "2-digit", minute: "2-digit" }
                );

                return (
                  <div
                    key={s.id}
                    className="session-dot"
                    title={`${workout?.name || "Workout"} – ${time}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}