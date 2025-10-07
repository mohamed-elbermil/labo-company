import React, { useState, useEffect } from 'react';
import { usePlanning } from '../../contexts/PlanningContext';

const EventForm = ({ event, onClose, onSubmit }) => {
  const { checkTimeConflict } = usePlanning();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teacher: '',
    room: '',
    day: 0,
    start: '09:00',
    end: '10:00',
    weekOffset: 0
  });
  const [errors, setErrors] = useState({});

  const days = [
    { value: 0, label: 'Lundi' },
    { value: 1, label: 'Mardi' },
    { value: 2, label: 'Mercredi' },
    { value: 3, label: 'Jeudi' },
    { value: 4, label: 'Vendredi' }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        teacher: event.teacher || '',
        room: event.room || '',
        day: event.day || 0,
        start: event.start || '09:00',
        end: event.end || '10:00',
        weekOffset: event.weekOffset || 0
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.teacher.trim()) {
      newErrors.teacher = 'Le professeur est requis';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'La salle est requise';
    }

    if (formData.start >= formData.end) {
      newErrors.end = 'L\'heure de fin doit être après l\'heure de début';
    }

    // Vérifier les conflits d'horaires
    if (checkTimeConflict(formData.day, formData.start, formData.end, event?.id)) {
      newErrors.time = 'Il y a un conflit d\'horaire avec un autre cours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur de conflit si elle existe
    if (errors.time) {
      setErrors(prev => ({
        ...prev,
        time: ''
      }));
    }
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form-modal">
        <div className="event-form-header">
          <h2>{event ? 'Modifier le cours' : 'Ajouter un nouveau cours'}</h2>
          <button 
            type="button" 
            className="event-form-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="event-form-row">
            <div className="event-form-field">
              <label>Titre du cours *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Mathématiques - Chapitre 3"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="event-form-field">
              <label>Professeur *</label>
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                placeholder="Ex: M. Dupont"
                className={errors.teacher ? 'error' : ''}
              />
              {errors.teacher && <span className="error-message">{errors.teacher}</span>}
            </div>
          </div>

          <div className="event-form-row">
            <div className="event-form-field">
              <label>Jour de la semaine *</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
              >
                {days.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="event-form-field">
              <label>Salle *</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="Ex: Salle 101, Labo Physique"
                className={errors.room ? 'error' : ''}
              />
              {errors.room && <span className="error-message">{errors.room}</span>}
            </div>
          </div>

          <div className="event-form-row">
            <div className="event-form-field">
              <label>Heure de début *</label>
              <select
                value={formData.start}
                onChange={(e) => handleTimeChange('start', e.target.value)}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="event-form-field">
              <label>Heure de fin *</label>
              <select
                value={formData.end}
                onChange={(e) => handleTimeChange('end', e.target.value)}
                className={errors.end ? 'error' : ''}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.end && <span className="error-message">{errors.end}</span>}
            </div>
          </div>

          <div className="event-form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du cours (optionnel)"
              rows="3"
            />
          </div>

          {errors.time && (
            <div className="error-message global-error">{errors.time}</div>
          )}

          <div className="event-form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              {event ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
