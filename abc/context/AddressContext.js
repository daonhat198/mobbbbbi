import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext(undefined);

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState(null);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddress must be used inside AddressProvider');
  return context;
};
