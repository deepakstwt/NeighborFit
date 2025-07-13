import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  user: null,
  preferences: {
    workStyle: '',
    familyStatus: '',
    lifestyle: '',
    priceRange: [10000, 100000],
    amenities: [],
    commutePreference: '',
    neighborhoodSize: '',
    safetyImportance: 5,
    nightlifeImportance: 3,
    greenSpaceImportance: 4,
    schoolQualityImportance: 3,
    publicTransportImportance: 4
  },
  matches: [],
  savedNeighborhoods: [],
  isLoading: false,
  error: null
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      const newState = { ...state, user: action.payload };
      if (action.payload && action.payload.preferences) {
        newState.preferences = { ...state.preferences, ...action.payload.preferences };
      }
      return newState;
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'ADD_SAVED_NEIGHBORHOOD':
      return { 
        ...state, 
        savedNeighborhoods: [...state.savedNeighborhoods, action.payload] 
      };
    case 'REMOVE_SAVED_NEIGHBORHOOD':
      return { 
        ...state, 
        savedNeighborhoods: state.savedNeighborhoods.filter(
          id => id !== action.payload
        ) 
      };
    case 'SET_SAVED_NEIGHBORHOODS':
      return { 
        ...state, 
        savedNeighborhoods: action.payload 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_PREFERENCES':
      return { ...state, preferences: initialState.preferences };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('neighborfit_user');
    const savedPreferences = localStorage.getItem('neighborfit_preferences');
    const savedNeighborhoods = localStorage.getItem('neighborfit_saved');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
    if (savedPreferences) {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: JSON.parse(savedPreferences) });
    }
    if (savedNeighborhoods) {
      dispatch({ type: 'SET_SAVED_NEIGHBORHOODS', payload: JSON.parse(savedNeighborhoods) });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('neighborfit_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('neighborfit_preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  useEffect(() => {
    localStorage.setItem('neighborfit_saved', JSON.stringify(state.savedNeighborhoods));
  }, [state.savedNeighborhoods]);

  const value = {
    ...state,
    dispatch,
    updatePreferences: (preferences) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    },
    saveNeighborhood: (neighborhoodId) => {
      dispatch({ type: 'ADD_SAVED_NEIGHBORHOOD', payload: neighborhoodId });
    },
    unsaveNeighborhood: (neighborhoodId) => {
      dispatch({ type: 'REMOVE_SAVED_NEIGHBORHOOD', payload: neighborhoodId });
    },
    setMatches: (matches) => {
      dispatch({ type: 'SET_MATCHES', payload: matches });
    },
    setUser: (user) => {
      dispatch({ type: 'SET_USER', payload: user });
    },
    setLoading: (isLoading) => {
      dispatch({ type: 'SET_LOADING', payload: isLoading });
    },
    setError: (error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
    login: (token, user) => {
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Set user in context
      dispatch({ type: 'SET_USER', payload: user });
      console.log('User logged in successfully:', user);
    }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 