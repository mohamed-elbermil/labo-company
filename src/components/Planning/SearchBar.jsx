import React, { useState, useEffect, useRef } from 'react';
import { usePlanning } from '../../contexts/PlanningContext';

const SearchBar = ({ onCourseSelect, currentWeek, onWeekChange }) => {
  const { events } = usePlanning();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);

  // Gestion du raccourci clavier Ctrl+K pour ouvrir la recherche
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtrer les cours selon le terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses([]);
      setShowResults(false);
      return;
    }

    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCourses(filtered);
    setShowResults(true);
    setSelectedIndex(-1);
  }, [searchTerm, events]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCourseClick = (course) => {
    // Changer la semaine si nécessaire
    if (course.weekOffset !== currentWeek) {
      onWeekChange(course.weekOffset);
    }
    
    // Sélectionner le cours
    onCourseSelect(course);
    
    // Fermer les résultats
    setShowResults(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (!showResults || filteredCourses.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCourses.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCourses.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCourses.length) {
          handleCourseClick(filteredCourses[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSearchTerm('');
        break;
    }
  };

  const getDayName = (day) => {
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    return dayNames[day];
  };

  const formatWeekLabel = (weekOffset) => {
    if (weekOffset === 0) return 'Semaine actuelle';
    if (weekOffset > 0) return `Semaine +${weekOffset}`;
    return `Semaine ${weekOffset}`;
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <svg 
          className="search-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Rechercher un cours, professeur, salle... (Ctrl+K)"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setShowResults(true)}
          className="search-input"
        />
        
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowResults(false);
            }}
            className="search-clear"
          >
            ×
          </button>
        )}
      </div>

      {showResults && filteredCourses.length > 0 && (
        <div className="search-results">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleCourseClick(course)}
            >
              <div className="search-result-header">
                <span className="search-result-title">{course.title}</span>
                <span className="search-result-week">
                  {formatWeekLabel(course.weekOffset)}
                </span>
              </div>
              
              <div className="search-result-details">
                <div className="search-result-info">
                  <span className="search-result-day">{getDayName(course.day)}</span>
                  <span className="search-result-time">{course.start} - {course.end}</span>
                </div>
                
                <div className="search-result-info">
                  <span className="search-result-teacher">{course.teacher}</span>
                  <span className="search-result-room">{course.room}</span>
                </div>
              </div>
              
              {course.description && (
                <div className="search-result-description">
                  {course.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showResults && filteredCourses.length === 0 && searchTerm && (
        <div className="search-no-results">
          Aucun cours trouvé pour "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
