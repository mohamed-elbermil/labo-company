import React, { useState } from 'react';
import { usePlanning } from '../contexts/PlanningContext';
import { useUser } from '../contexts/UserContext';
import Navbar from '../components/Navbar/NavBar.jsx';
import EventForm from '../components/Planning/EventForm.jsx';
import './auth.css';

function Admin() {
  const { events, deleteEvent, loading } = usePlanning();
  const { isAdmin } = useUser();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterDay, setFilterDay] = useState('all');

  // Si l'utilisateur n'est pas admin, rediriger
  if (!isAdmin()) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Accès refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <a href="/home" className="auth-link">Retour au planning</a>
        </div>
      </div>
    );
  }

  const days = [
    { value: 'all', label: 'Tous les jours' },
    { value: 0, label: 'Lundi' },
    { value: 1, label: 'Mardi' },
    { value: 2, label: 'Mercredi' },
    { value: 3, label: 'Jeudi' },
    { value: 4, label: 'Vendredi' }
  ];

  const filteredEvents = filterDay === 'all' 
    ? events 
    : events.filter(event => event.day === parseInt(filterDay));

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
    // Cette fonction sera gérée par le PlanningContext
    setShowEventForm(false);
  };

  const getDayName = (day) => {
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    return dayNames[day];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#6b7280' }}>
              Chargement...
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#111827',
              margin: 0
            }}>
              Administration du Planning
            </h1>
            
            <button 
              onClick={handleAddEvent}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un cours
            </button>
          </div>

          {/* Filtres */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center',
            marginBottom: '30px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '10px'
          }}>
            <label style={{ fontWeight: '600', color: '#374151' }}>
              Filtrer par jour :
            </label>
            <select 
              value={filterDay} 
              onChange={(e) => setFilterDay(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                background: 'white'
              }}
            >
              {days.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            
            <div style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              marginLeft: 'auto'
            }}>
              {filteredEvents.length} cours trouvé(s)
            </div>
          </div>

          {/* Liste des événements */}
          <div style={{ 
            display: 'grid', 
            gap: '16px'
          }}>
            {filteredEvents.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                background: '#f9fafb',
                borderRadius: '10px',
                color: '#6b7280'
              }}>
                <p style={{ fontSize: '16px', margin: 0 }}>
                  {filterDay === 'all' 
                    ? 'Aucun cours programmé' 
                    : `Aucun cours programmé le ${getDayName(parseInt(filterDay))}`
                  }
                </p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div 
                  key={event.id}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'start',
                    gap: '20px'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#111827',
                        margin: '0 0 8px 0'
                      }}>
                        {event.title}
                      </h3>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <strong style={{ color: '#374151' }}>Jour :</strong>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {getDayName(event.day)}
                          </span>
                        </div>
                        
                        <div>
                          <strong style={{ color: '#374151' }}>Horaires :</strong>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {event.start} - {event.end}
                          </span>
                        </div>
                        
                        <div>
                          <strong style={{ color: '#374151' }}>Professeur :</strong>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {event.teacher}
                          </span>
                        </div>
                        
                        <div>
                          <strong style={{ color: '#374151' }}>Salle :</strong>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {event.room}
                          </span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <div>
                          <strong style={{ color: '#374151' }}>Description :</strong>
                          <p style={{ 
                            margin: '4px 0 0 0', 
                            color: '#6b7280',
                            lineHeight: '1.5'
                          }}>
                            {event.description}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      flexDirection: 'column'
                    }}>
                      <button 
                        onClick={() => handleEditEvent(event)}
                        style={{
                          background: '#6366f1',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Modifier
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSubmit={handleSubmitEvent}
          onClose={() => setShowEventForm(false)}
        />
      )}
    </>
  );
}

export default Admin;
