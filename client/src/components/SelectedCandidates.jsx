import React from 'react';
import { useCandidates } from '../context/CandidateContext';
import CandidateCard from './CandidateCard';

export default function SelectedCandidates() {
  const { state } = useCandidates();
  const { selectedCandidates } = state;
  
  // Calculate diversity metrics
  const locations = [...new Set(selectedCandidates.map(c => c.location))];
  const educationLevels = [...new Set(selectedCandidates.map(c => c.education?.highest_level).filter(Boolean))];
  const skills = [...new Set(selectedCandidates.flatMap(c => c.skills || []))];
  
  const minExperience = selectedCandidates.length > 0 ? 
    Math.min(...selectedCandidates.map(c => c.work_experiences?.length || 0)) : 0;
    
  const maxExperience = selectedCandidates.length > 0 ? 
    Math.max(...selectedCandidates.map(c => c.work_experiences?.length || 0)) : 0;
    
  // Calculate average match score of team
  const averageMatchScore = selectedCandidates.length > 0 ?
    Math.round(selectedCandidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) / selectedCandidates.length) : 0;
  
  // Calculate total salary budget
  const totalSalary = selectedCandidates.reduce((sum, candidate) => {
    const salaryStr = candidate.annual_salary_expectation?.["full-time"];
    if (!salaryStr) return sum;
    
    const salary = parseInt(salaryStr.replace(/[^0-9]/g, ''));
    return sum + (isNaN(salary) ? 0 : salary);
  }, 0);
  
  // Find top 5 common skills across team
  const skillFrequency = {};
  selectedCandidates.forEach(candidate => {
    candidate.skills?.forEach(skill => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });
  
  const topTeamSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);
  
  return (
    <div className="team-panel">
      <div className="team-header">
        <h2>Your Hiring Selection</h2>
        <span className="team-count">
          {selectedCandidates.length}/5 candidates selected
        </span>
      </div>
      
      {selectedCandidates.length > 0 ? (
        <div>
          <div className="team-metrics">
            <div className="metrics-row">
            <div className="metric-card">
              <h4>Match Score</h4>
              <div className={`metric-value ${averageMatchScore >= 80 ? 'high-score' : averageMatchScore >= 40 ? 'medium-score' : 'low-score'}`}>
                {averageMatchScore}% Average
              </div>
              <div className="metric-detail">
                Team skill match average
              </div>
            </div>              <div className="metric-card">
                <h4>Global Presence</h4>
                <div className="metric-value">{locations.length} {locations.length === 1 ? 'region' : 'regions'}</div>
                <div className="metric-detail">
                  {locations.slice(0, 3).join(', ')}
                  {locations.length > 3 && '...'}
                </div>
              </div>
            </div>
            
            <div className="metrics-row">
              <div className="metric-card">
                <h4>Education Mix</h4>
                <div className="metric-value">{educationLevels.length} {educationLevels.length === 1 ? 'level' : 'levels'}</div>
                <div className="metric-detail">
                  {educationLevels.slice(0, 2).join(', ')}
                  {educationLevels.length > 2 && '...'}
                </div>
              </div>
              
              <div className="metric-card">
                <h4>Experience Range</h4>
                <div className="metric-value">
                  {selectedCandidates.length > 0 ? `${minExperience} - ${maxExperience} positions` : 'N/A'}
                </div>
                <div className="metric-detail">
                  {selectedCandidates.length > 0 ? 
                    `${Math.round((minExperience + maxExperience) / 2)} avg. positions` : 'Select candidates'}
                </div>
              </div>
            </div>
            
            <div className="metrics-row">
              <div className="metric-card">
                <h4>Salary Budget</h4>
                <div className="metric-value">${totalSalary.toLocaleString()}</div>
                <div className="metric-detail">
                  ${Math.round(totalSalary / (selectedCandidates.length || 1)).toLocaleString()} average
                </div>
              </div>
            </div>
          </div>
          
          {topTeamSkills.length > 0 && (
            <div className="team-skills">
              <h4>Team Skill Coverage</h4>
              <div className="skill-tags">
                {topTeamSkills.map(skill => (
                  <span key={skill} className="team-skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="selected-candidates-list">
            {selectedCandidates.map(candidate => (
              <CandidateCard key={candidate.email} candidate={candidate} />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-team">
          <div className="empty-icon">👥</div>
          <p>No candidates selected yet.</p>
          <p>Select up to 5 candidates to build your team.</p>
        </div>
      )}
    </div>
  );
}