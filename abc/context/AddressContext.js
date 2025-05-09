import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext(undefined);

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <AddressContext.Provider
      value={{ addresses, setAddresses, selectedAddress, setSelectedAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddress must be used inside AddressProvider');
  return context;
};
