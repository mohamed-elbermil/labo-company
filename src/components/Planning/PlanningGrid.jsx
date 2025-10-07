// PlanningGrid.jsx
import React, { useState } from "react";
import { usePlanning } from "../../contexts/PlanningContext";
import { useUser } from "../../contexts/UserContext";
import EventForm from "./EventForm";
import "./planning.css";

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
const timeSlots = [
  "08:00","09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00"
];

function PlanningGrid() {
  const { events, loading, addEvent, updateEvent, deleteEvent } = usePlanning();
  const { isAdmin } = useUser();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      deleteEvent(eventId);
    }
  };

  const handleSubmitEvent = (formData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }
  };

  if (loading) {
    return (
      <div className="planning-wrapper">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>
            Chargement du planning...
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="planning-wrapper">
      {isAdmin() && (
        <button 
          className="add-event-btn"
          onClick={handleAddEvent}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un cours
        </button>
      )}

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

          {events.map((evt) => (
            <EventBlock 
              key={evt.id} 
              evt={evt} 
              isAdmin={isAdmin()}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      </div>

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSubmit={handleSubmitEvent}
          onClose={() => setShowEventForm(false)}
        />
      )}
    </div>
  );
}

function minutesFrom(timeStr) {
  const [h, m] = timeStr.split(":" ).map(Number);
  return h * 60 + m;
}

function EventBlock({ evt, isAdmin, onEdit, onDelete }) {
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
    <div 
      className={`planning-event ${isAdmin ? 'editable' : ''}`} 
      style={style}
      onClick={isAdmin ? () => onEdit(evt) : undefined}
    >
      <div className="planning-event-time">{evt.start} - {evt.end}</div>
      <div className="planning-event-title">{evt.title}</div>
      {evt.teacher && (
        <div className="planning-event-teacher">{evt.teacher}</div>
      )}
      {evt.room && (
        <div className="planning-event-room">{evt.room}</div>
      )}
      
      {isAdmin && (
        <div className="planning-event-actions">
          <button 
            className="planning-event-btn edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(evt);
            }}
          >
            Modifier
          </button>
          <button 
            className="planning-event-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(evt.id);
            }}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

export default PlanningGrid;


