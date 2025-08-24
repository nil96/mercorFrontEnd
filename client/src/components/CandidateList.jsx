import React, { useState, useEffect } from 'react';
import { useCandidates } from '../context/CandidateContext';
import CandidateCard from './CandidateCard';

export default function CandidateList() {
  const { state, dispatch } = useCandidates();
  const { candidates, loading, error, pagination, filters } = state;
  const [sortBy, setSortBy] = useState('match'); // 'match', 'latest', 'salary-high', 'salary-low', 'experience'
  
  // Set default sort to match score when skills filter is used
  useEffect(() => {
    if (filters.skills) {
      setSortBy('match');
    }
  }, [filters.skills]);
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
      dispatch({
        type: 'SET_PAGE',
        payload: newPage
      });
    }
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Sort candidates based on selected criteria
  const sortedCandidates = [...candidates].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        // First by match score (descending)
        return (b.matchScore || 0) - (a.matchScore || 0);
        
      case 'salary-high':
        const salaryA = a.annual_salary_expectation?.["full-time"] ? 
          parseInt(a.annual_salary_expectation["full-time"].replace(/[^0-9]/g, '')) : 0;
        const salaryB = b.annual_salary_expectation?.["full-time"] ? 
          parseInt(b.annual_salary_expectation["full-time"].replace(/[^0-9]/g, '')) : 0;
        return salaryB - salaryA;
        
      case 'salary-low':
        const salaryLowA = a.annual_salary_expectation?.["full-time"] ? 
          parseInt(a.annual_salary_expectation["full-time"].replace(/[^0-9]/g, '')) : Infinity;
        const salaryLowB = b.annual_salary_expectation?.["full-time"] ? 
          parseInt(b.annual_salary_expectation["full-time"].replace(/[^0-9]/g, '')) : Infinity;
        return salaryLowA - salaryLowB;
        
      case 'experience':
        return (b.work_experiences?.length || 0) - (a.work_experiences?.length || 0);
        
      case 'latest':
      default:
        const dateA = new Date(a.submitted_at || 0);
        const dateB = new Date(b.submitted_at || 0);
        return dateB - dateA;
    }
  });
  
  // Determine if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading candidates...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="results-container">
        <div className="error-message">
          <h3>Error Loading Candidates</h3>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-count">
          <h2>Candidates ({pagination.total})</h2>
          {hasActiveFilters && (
            <div className="filter-active-badge">Filters Active</div>
          )}
        </div>
        
        <div className="results-actions">
          <div className="sort-controls">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="match">Best Match</option>
              <option value="latest">Most Recent</option>
              <option value="salary-high">Salary (High to Low)</option>
              <option value="salary-low">Salary (Low to High)</option>
              <option value="experience">Most Experience</option>
            </select>
          </div>
          
          <div className="pagination-controls">
            <button 
              className="page-button"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              &laquo; Previous
            </button>
            <span className="page-indicator">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              className="page-button"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
      
      {sortedCandidates.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No Candidates Found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {sortedCandidates.map(candidate => (
            <CandidateCard key={candidate.email} candidate={candidate} />
          ))}
        </div>
      )}
      
      {pagination.total > pagination.limit && (
        <div className="bottom-pagination">
          <button 
            className="page-button"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            &laquo; Previous
          </button>
          <span className="page-indicator">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            className="page-button"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}