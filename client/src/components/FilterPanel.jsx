import React, { useState } from 'react';
import { useCandidates } from '../context/CandidateContext';

export default function FilterPanel() {
  const { state, dispatch } = useCandidates();
  const { filters } = state;
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_FILTERS',
      payload: { [name]: value }
    });
  };
  
  const clearFilters = () => {
    dispatch({
      type: 'UPDATE_FILTERS',
      payload: {
        skills: '',
        skillMatchType: 'any',
        minExperience: '',
        education: '',
        location: '',
        name: '',
        company: '',
        roleName: '',
        minSalary: '',
        maxSalary: ''
      }
    });
  };
  
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Search Candidates</h2>
        <button 
          className="clear-btn"
          onClick={clearFilters}
        >
          Clear All Filters
        </button>
      </div>
      
      <div className="filter-basic">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="name">Candidate Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="skills">Skills:</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              placeholder="React, Python, AWS, etc."
              className="filter-input"
            />
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group skill-match">
            <label>Skills Matching:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="skillMatchType"
                  value="any"
                  checked={filters.skillMatchType === 'any'}
                  onChange={handleFilterChange}
                />
                Match Any Skill
              </label>
              <label>
                <input
                  type="radio"
                  name="skillMatchType"
                  value="all"
                  checked={filters.skillMatchType === 'all'}
                  onChange={handleFilterChange}
                />
                Match All Skills
              </label>
            </div>
          </div>
          
          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Country, city, region"
              className="filter-input"
            />
          </div>
        </div>
      </div>
      
      <div className="advanced-toggle" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}>
        {isAdvancedOpen ? 'Hide Advanced Filters ▲' : 'Show Advanced Filters ▼'}
      </div>
      
      {isAdvancedOpen && (
        <div className="filter-advanced">
          <div className="filter-section">
            <h3>Experience & Education</h3>
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="minExperience">Minimum Experience:</label>
                <select
                  id="minExperience"
                  name="minExperience"
                  value={filters.minExperience}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="1">1+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                  <option value="7">7+ years</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="education">Education Level:</label>
                <select
                  id="education"
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="High School Diploma">High School</option>
                  <option value="Associate's Degree">Associate's</option>
                  <option value="Bachelor's Degree">Bachelor's</option>
                  <option value="Master's Degree">Master's</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Work History</h3>
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="company">Company:</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={filters.company}
                  onChange={handleFilterChange}
                  placeholder="Previous employer"
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="roleName">Role/Position:</label>
                <input
                  type="text"
                  id="roleName"
                  name="roleName"
                  value={filters.roleName}
                  onChange={handleFilterChange}
                  placeholder="Job title"
                  className="filter-input"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Salary Expectations</h3>
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="minSalary">Min Salary:</label>
                <input
                  type="number"
                  id="minSalary"
                  name="minSalary"
                  value={filters.minSalary}
                  onChange={handleFilterChange}
                  placeholder="Min $"
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="maxSalary">Max Salary:</label>
                <input
                  type="number"
                  id="maxSalary"
                  name="maxSalary"
                  value={filters.maxSalary}
                  onChange={handleFilterChange}
                  placeholder="Max $"
                  className="filter-input"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}