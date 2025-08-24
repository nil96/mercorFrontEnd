import React, { useEffect } from 'react';
import { useCandidates } from './context/CandidateContext';
import { fetchCandidates } from './services/api';
import FilterPanel from './components/FilterPanel';
import CandidateList from './components/CandidateList';
import SelectedCandidates from './components/SelectedCandidates';

function App() {
  const { state, dispatch } = useCandidates();
  const { filters, pagination } = state;
  
  // Fetch candidates when filters or pagination changes
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        dispatch({ type: 'FETCH_CANDIDATES_START' });
        const data = await fetchCandidates(
          filters, 
          pagination.page, 
          pagination.limit
        );
        
        dispatch({
          type: 'FETCH_CANDIDATES_SUCCESS',
          payload: {
            candidates: data.candidates,
            total: data.total
          }
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_CANDIDATES_ERROR',
          payload: error
        });
      }
    };
    
    loadCandidates();
  }, [filters, pagination.page, pagination.limit]);
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <h1>Mercor Hiring Dashboard</h1>
          </div>
          <div className="header-tagline">
            <p>Build your dream team from top talent</p>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="sidebar">
          <FilterPanel />
          <SelectedCandidates />
        </div>
        
        <div className="main-content">
          <CandidateList />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 Mercor Hiring Dashboard</p>
      </footer>
    </div>
  );
}

export default App;