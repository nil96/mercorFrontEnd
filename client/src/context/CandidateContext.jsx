import { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  candidates: [],
  filteredCandidates: [],
  loading: false,
  error: null,
  selectedCandidates: [],
  filters: {
    skills: '',
    skillMatchType: 'any', // 'any' or 'all'
    minExperience: '',
    education: '',
    location: '',
    name: '',
    company: '',
    roleName: '',
    minSalary: '',
    maxSalary: ''
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  }
};

// Action types
const FETCH_CANDIDATES_START = 'FETCH_CANDIDATES_START';
const FETCH_CANDIDATES_SUCCESS = 'FETCH_CANDIDATES_SUCCESS';
const FETCH_CANDIDATES_ERROR = 'FETCH_CANDIDATES_ERROR';
const UPDATE_FILTERS = 'UPDATE_FILTERS';
const SELECT_CANDIDATE = 'SELECT_CANDIDATE';
const REMOVE_CANDIDATE = 'REMOVE_CANDIDATE';
const SET_PAGE = 'SET_PAGE';

// Reducer
function candidateReducer(state, action) {
  switch (action.type) {
    case FETCH_CANDIDATES_START:
      return { ...state, loading: true };
    case FETCH_CANDIDATES_SUCCESS:
      return { 
        ...state, 
        candidates: action.payload.candidates,
        pagination: {
          ...state.pagination,
          total: action.payload.total
        },
        loading: false 
      };
    case FETCH_CANDIDATES_ERROR:
      return { ...state, error: action.payload, loading: false };
    case UPDATE_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 } // Reset to page 1 when filters change
      };
    case SELECT_CANDIDATE:
      // Don't add if already selected or if we already have 5
      if (state.selectedCandidates.some(c => c.email === action.payload.email) || 
          state.selectedCandidates.length >= 5) {
        return state;
      }
      return {
        ...state,
        selectedCandidates: [...state.selectedCandidates, action.payload]
      };
    case REMOVE_CANDIDATE:
      return {
        ...state,
        selectedCandidates: state.selectedCandidates.filter(
          c => c.email !== action.payload.email
        )
      };
    case SET_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload }
      };
    default:
      return state;
  }
}

// Create context
const CandidateContext = createContext();

// Provider component
export function CandidateProvider({ children }) {
  const [state, dispatch] = useReducer(candidateReducer, initialState);
  
  return (
    <CandidateContext.Provider value={{ state, dispatch }}>
      {children}
    </CandidateContext.Provider>
  );
}

// Custom hook to use the context
export function useCandidates() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidateProvider');
  }
  return context;
}