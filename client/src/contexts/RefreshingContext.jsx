import { createContext, useContext, useReducer } from 'react';
import { dataReducer, initState } from './reducer.js';

const RefreshingContext = createContext();

export const RefreshingProvider = ({ children }) => {
  const [refreshing, refreshingDispatch] = useReducer(dataReducer, initState)

  return (
    <RefreshingContext.Provider value={{ refreshing, refreshingDispatch }}>{children}</RefreshingContext.Provider>
  );
}
export const useRefreshing = () => useContext(RefreshingContext);