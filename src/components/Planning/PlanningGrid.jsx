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
  const { events, loading, addEvent, updateEvent, deleteEvent, getEventsByWeek } = usePlanning();
  const { isAdmin } = useUser();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = semaine actuelle

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
      // Ajouter l'offset de semaine pour les nouveaux événements
      const eventWithWeek = { ...formData, weekOffset: currentWeek };
      addEvent(eventWithWeek);
    }
  };

  // Obtenir les événements pour la semaine actuelle
  const currentWeekEvents = getEventsByWeek(currentWeek);

  // Fonctions pour la navigation par semaines
  const getWeekDates = (weekOffset) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Ajuster pour commencer le lundi
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));
    
    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };

  const formatWeekRange = (weekOffset) => {
    const weekDates = getWeekDates(weekOffset);
    const start = weekDates[0];
    const end = weekDates[4];
    
    if (weekOffset === 0) {
      return `Semaine actuelle (${start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })})`;
    } else if (weekOffset > 0) {
      return `Semaine +${weekOffset} (${start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })})`;
    } else {
      return `Semaine ${weekOffset} (${start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })})`;
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => prev + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(0);
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
      {/* Navigation par semaines */}
      <div className="week-navigation">
        <button 
          className="week-nav-btn"
          onClick={goToPreviousWeek}
          title="Semaine précédente"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="week-info">
          <span className="week-title">{formatWeekRange(currentWeek)}</span>
          {currentWeek !== 0 && (
            <button 
              className="current-week-btn"
              onClick={goToCurrentWeek}
              title="Retour à la semaine actuelle"
            >
              Revenir à la semaine actuelle
            </button>
          )}
        </div>
        
        <button 
          className="week-nav-btn"
          onClick={goToNextWeek}
          title="Semaine suivante"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

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
        {getWeekDates(currentWeek).map((date, index) => (
          <div key={index} className="planning-day">
            <div className="day-name">{days[index]}</div>
            <div className="day-date">{date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</div>
          </div>
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

          {currentWeekEvents.map((evt) => (
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


