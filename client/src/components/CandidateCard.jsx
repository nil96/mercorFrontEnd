import React, { useState } from 'react';
import { useCandidates } from '../context/CandidateContext';

export default function CandidateCard({ candidate }) {
  const { state, dispatch } = useCandidates();
  const [showDetails, setShowDetails] = useState(false);
  const isSelected = state.selectedCandidates.some(
    c => c.email === candidate.email
  );
  
  const matchScore = candidate.matchScore || 0;
  const matchDetails = candidate.matchDetails || { skillsMatch: 0, totalSkills: 0 };
  
  const handleSelect = () => {
    if (isSelected) {
      dispatch({
        type: 'REMOVE_CANDIDATE',
        payload: candidate
      });
    } else if (state.selectedCandidates.length < 5) {
      dispatch({
        type: 'SELECT_CANDIDATE',
        payload: candidate
      });
    } else {
      alert('You can only select up to 5 candidates');
    }
  };
  
  const formatSalary = (salaryString) => {
    if (!salaryString) return 'Not specified';
    return salaryString;
  };
  
  // Get the most recent role
  const lastRole = candidate.work_experiences?.[0];
  
  // Calculate years of experience
  const yearsOfExperience = candidate.work_experiences?.length || 0;
  
  // Get education highlight
  const educationHighlight = candidate.education?.degrees?.[0];
  
  // Determine match class and label based on score
  const getMatchClass = (score) => {
    if (score >= 80) return 'match-high';
    if (score >= 40) return 'match-medium';
    return 'match-low';
  };
  
  const getMatchLabel = (score) => {
    if (score >= 80) return 'Strong Match';
    if (score >= 40) return 'Good Match';
    if (score > 0) return 'Partial Match';
    return 'No Match';
  };
  
  return (
    <div className={`candidate-card ${isSelected ? 'selected-candidate' : ''}`}>
      <div className="card-header">
        <div className="name-badge">
          <h3>{candidate.name || 'Unnamed Candidate'}</h3>
          {isSelected && <span className="selected-badge">Selected</span>}
        </div>
        <div className="candidate-location">📍 {candidate.location || 'Unknown location'}</div>
        
        {/* Match Score Indicator */}
        {matchDetails.totalSkills > 0 && (
          <div className={`match-indicator ${getMatchClass(matchScore)}`}>
            <div className="match-score">{matchScore}%</div>
            <div className="match-label">{getMatchLabel(matchScore)}</div>
            {matchDetails.skillsMatch > 0 && (
              <div className="match-details">
                {matchDetails.skillsMatch}/{matchDetails.totalSkills} skills matched
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="card-body">
        <div className="candidate-highlights">
          {lastRole && (
            <div className="highlight-item">
              <span className="highlight-icon">💼</span>
              <div className="highlight-content">
                <div className="highlight-title">{lastRole.roleName}</div>
                <div className="highlight-subtitle">{lastRole.company}</div>
              </div>
            </div>
          )}
          
          {candidate.education?.highest_level && (
            <div className="highlight-item">
              <span className="highlight-icon">🎓</span>
              <div className="highlight-content">
                <div className="highlight-title">{candidate.education.highest_level}</div>
                {educationHighlight && (
                  <div className="highlight-subtitle">{educationHighlight.subject || educationHighlight.school}</div>
                )}
              </div>
            </div>
          )}
          
          {candidate.annual_salary_expectation?.["full-time"] && (
            <div className="highlight-item">
              <span className="highlight-icon">💰</span>
              <div className="highlight-content">
                <div className="highlight-title">{formatSalary(candidate.annual_salary_expectation["full-time"])}</div>
                <div className="highlight-subtitle">Expected salary</div>
              </div>
            </div>
          )}
        </div>
        
        {candidate.skills?.length > 0 && (
          <div className="candidate-skills">
            {candidate.skills.slice(0, 5).map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
            {candidate.skills.length > 5 && 
              <span className="more-skills">+{candidate.skills.length - 5}</span>
            }
          </div>
        )}
        
        {showDetails && (
          <div className="candidate-details">
            <h4>Work Experience</h4>
            {candidate.work_experiences?.length > 0 ? (
              <ul className="experience-list">
                {candidate.work_experiences.map((exp, index) => (
                  <li key={index}>
                    <strong>{exp.roleName}</strong> at {exp.company}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No work experience listed</p>
            )}
            
            <h4>Education</h4>
            {candidate.education?.degrees?.length > 0 ? (
              <ul className="education-list">
                {candidate.education.degrees.map((degree, index) => (
                  <li key={index}>
                    {degree.degree} in {degree.subject} from {degree.originalSchool}
                    {degree.gpa && <span> ({degree.gpa})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No education details listed</p>
            )}
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <button 
          className="details-button"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        <button 
          className={`select-button ${isSelected ? 'selected' : ''}`}
          onClick={handleSelect}
        >
          {isSelected ? 'Remove' : 'Select Candidate'}
        </button>
      </div>
    </div>
  );
}