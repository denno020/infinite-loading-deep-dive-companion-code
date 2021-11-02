import React, { createContext, useContext, useMemo, useRef } from 'react';

const AppContext = createContext();

const AppContextProvider = (props) => {
  const { children } = props;
  const categoryHistory = useRef({});

  const addToCategoryHistory = (products, category = 'category-products') => {
    categoryHistory.current[category] = products;
  };

  const getCategoryHistory = (category = 'category-products') => {
    if (!categoryHistory.current[category]) {
      return [];
    }

    const history = [...categoryHistory.current[category]];
    delete categoryHistory.current[category];
    return history;
  }

  const contextValue = useMemo(() => ({
    addToCategoryHistory,
    getCategoryHistory
    
  }), [addToCategoryHistory, getCategoryHistory])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;