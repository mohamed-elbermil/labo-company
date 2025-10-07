import React, { createContext, useContext, useState, useEffect } from 'react';

const PlanningContext = createContext();

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning doit être utilisé dans un PlanningProvider');
  }
  return context;
};

export const PlanningProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données par défaut du planning
  // Générer des événements pour différentes semaines
  const generateDefaultEvents = () => {
    const events = [];
    const today = new Date();
    
    // Événements pour la semaine actuelle
    const currentWeekEvents = [
      { 
        id: 1, 
        day: 0, 
        start: "09:00", 
        end: "10:30", 
        title: "Maths - DM Chapitre 2",
        description: "Devoir maison sur les fonctions",
        teacher: "M. Dupont",
        room: "Salle 101",
        weekOffset: 0
      },
      { 
        id: 2, 
        day: 1, 
        start: "11:00", 
        end: "12:00", 
        title: "Histoire - Lecture",
        description: "Lecture de documents historiques",
        teacher: "Mme Martin",
        room: "Salle 205",
        weekOffset: 0
      },
      { 
        id: 3, 
        day: 2, 
        start: "14:00", 
        end: "16:00", 
        title: "Physique - Exos série 3",
        description: "Exercices de mécanique",
        teacher: "M. Bernard",
        room: "Labo Physique",
        weekOffset: 0
      },
      { 
        id: 4, 
        day: 3, 
        start: "08:30", 
        end: "09:30", 
        title: "Anglais - Vocabulaire",
        description: "Enrichissement du vocabulaire",
        teacher: "Mme Johnson",
        room: "Salle 103",
        weekOffset: 0
      },
      { 
        id: 5, 
        day: 4, 
        start: "15:00", 
        end: "17:00", 
        title: "SVT - Compte-rendu TP",
        description: "Rédaction du compte-rendu",
        teacher: "M. Rousseau",
        room: "Labo SVT",
        weekOffset: 0
      },
    ];
    
    // Événements pour la semaine suivante
    const nextWeekEvents = [
      { 
        id: 6, 
        day: 0, 
        start: "10:00", 
        end: "11:30", 
        title: "Maths - Contrôle",
        description: "Contrôle sur les fonctions",
        teacher: "M. Dupont",
        room: "Salle 101",
        weekOffset: 1
      },
      { 
        id: 7, 
        day: 2, 
        start: "13:00", 
        end: "15:00", 
        title: "Physique - TP",
        description: "Travaux pratiques de mécanique",
        teacher: "M. Bernard",
        room: "Labo Physique",
        weekOffset: 1
      },
      { 
        id: 8, 
        day: 4, 
        start: "09:00", 
        end: "10:00", 
        title: "Anglais - Oral",
        description: "Présentation orale",
        teacher: "Mme Johnson",
        room: "Salle 103",
        weekOffset: 1
      },
    ];
    
    return [...currentWeekEvents, ...nextWeekEvents];
  };

  const defaultEvents = generateDefaultEvents();

  useEffect(() => {
    // Simuler un délai de chargement
    setTimeout(() => {
      const savedEvents = localStorage.getItem('planningEvents');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        setEvents(defaultEvents);
        localStorage.setItem('planningEvents', JSON.stringify(defaultEvents));
      }
      setLoading(false);
    }, 500);
  }, []);

  // Sauvegarder automatiquement dans le localStorage quand les événements changent
  useEffect(() => {
    if (!loading && events.length > 0) {
      localStorage.setItem('planningEvents', JSON.stringify(events));
    }
  }, [events, loading]);

  const addEvent = (newEvent) => {
    const event = {
      ...newEvent,
      id: Date.now(), // Générer un ID unique
    };
    
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, event];
      return updatedEvents;
    });
    
    return event;
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  const getEventsByDay = (day) => {
    return events.filter(event => event.day === day);
  };

  const getEventsByTimeRange = (startTime, endTime) => {
    return events.filter(event => {
      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);
      const rangeStart = timeToMinutes(startTime);
      const rangeEnd = timeToMinutes(endTime);
      
      return (eventStart >= rangeStart && eventStart < rangeEnd) ||
             (eventEnd > rangeStart && eventEnd <= rangeEnd) ||
             (eventStart <= rangeStart && eventEnd >= rangeEnd);
    });
  };

  const getEventsByWeek = (weekOffset) => {
    return events.filter(event => event.weekOffset === weekOffset);
  };

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const checkTimeConflict = (day, start, end, excludeId = null) => {
    return events.some(event => {
      if (event.id === excludeId) return false;
      if (event.day !== day) return false;
      
      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);
      const newStart = timeToMinutes(start);
      const newEnd = timeToMinutes(end);
      
      return (newStart < eventEnd && newEnd > eventStart);
    });
  };

  const value = {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDay,
    getEventsByTimeRange,
    getEventsByWeek,
    checkTimeConflict,
    timeToMinutes,
    minutesToTime
  };

  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
};
