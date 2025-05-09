import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const saved = await AsyncStorage.getItem(`orders_${user.uid}`);
        if (saved) setOrders(JSON.parse(saved));
      }
    };
    fetchOrders();
  }, []);

  const addOrder = async (order) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const newOrders = [...orders, order];
    setOrders(newOrders);
    await AsyncStorage.setItem(`orders_${user.uid}`, JSON.stringify(newOrders));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
