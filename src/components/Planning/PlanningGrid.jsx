// PlanningGrid.jsx
import React from "react";
import "./planning.css";

// Données mock (front uniquement)
const mockEvents = [
  { id: 1, day: 0, start: "09:00", end: "10:30", title: "Maths - DM Chapitre 2" },
  { id: 2, day: 1, start: "11:00", end: "12:00", title: "Histoire - Lecture" },
  { id: 3, day: 2, start: "14:00", end: "16:00", title: "Physique - Exos série 3" },
  { id: 4, day: 3, start: "08:30", end: "09:30", title: "Anglais - Vocabulaire" },
  { id: 5, day: 4, start: "15:00", end: "17:00", title: "SVT - Compte-rendu TP" },
];

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
const timeSlots = [
  "08:00","09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00"
];

function PlanningGrid() {
  return (
    <div className="planning-wrapper">
      <div className="planning-header">
        <div className="planning-corner" />
        {days.map((d) => (
          <div key={d} className="planning-day">{d}</div>
        ))}
      </div>

      <div className="planning-body">
        <div className="planning-times">
          {timeSlots.map((t) => (
            <div key={t} className="planning-time">{t}</div>
          ))}
        </div>

        <div className="planning-grid">
          {timeSlots.map((t) => (
            <div key={t} className="planning-row" />
          ))}

          {mockEvents.map((evt) => (
            <EventBlock key={evt.id} evt={evt} />
          ))}
        </div>
      </div>
    </div>
  );
}

function minutesFrom(timeStr) {
  const [h, m] = timeStr.split(":" ).map(Number);
  return h * 60 + m;
}

function EventBlock({ evt }) {
  const gridStart = minutesFrom(evt.start);
  const gridEnd = minutesFrom(evt.end);
  const dayColumn = evt.day + 1; // 1..5 dans la grille (col 0 = heures)

  const totalMinutes = minutesFrom("18:00") - minutesFrom("08:00");
  const startOffset = gridStart - minutesFrom("08:00");
  const duration = gridEnd - gridStart;

  const topPercent = (startOffset / totalMinutes) * 100;
  const heightPercent = (duration / totalMinutes) * 100;

  const style = {
    gridColumn: dayColumn,
    top: `${topPercent}%`,
    height: `${heightPercent}%`,
  };

  return (
    <div className="planning-event" style={style}>
      <div className="planning-event-time">{evt.start} - {evt.end}</div>
      <div className="planning-event-title">{evt.title}</div>
    </div>
  );
}

export default PlanningGrid;


