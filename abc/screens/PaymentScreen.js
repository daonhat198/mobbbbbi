import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [orderCounter, setOrderCounter] = useState(1);

  useEffect(() => {
    const loadOrderCounter = async () => {
      const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại, ví dụ: 2025-05-09
      const savedCounter = await AsyncStorage.getItem(`orderCounter_${today}`);
      if (savedCounter) {
        setOrderCounter(parseInt(savedCounter) + 1);
      }
    };
    loadOrderCounter();
  }, []);

  const handleCashOnDelivery = async () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Định dạng YYYYMMDD
    const orderId = `DH${today}-${orderCounter.toString().padStart(3, '0')}`; // Ví dụ: DH20250509-001
    const order = {
      id: orderId,
      items: cart,
      date: new Date().toISOString(),
      status: 'pending',
    };

    await addOrder(order);
    clearCart();

    // Lưu lại số thứ tự cho ngày hôm nay
    const newCounter = orderCounter + 1;
    const todayKey = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(`orderCounter_${todayKey}`, newCounter.toString());

    Alert.alert('Thành công', 'Đặt hàng thành công!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Payment method</Text>
          <View style={{ width: 24 }} /> {/* Cân bằng layout */}
        </View>

        <Text style={styles.subtitle}>Pick a payment option</Text>

        {/* Các phương thức thanh toán */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#1e1e1e' }]}
          onPress={() => alert('Chức năng thanh toán bằng thẻ chưa được hỗ trợ.')}>
          <Text style={styles.buttonText}>Pay using Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#e73ec2' }]}
          onPress={() => alert('Chức năng thanh toán bằng chuyển khoản ngân hàng chưa được hỗ trợ.')}>
          <Text style={styles.buttonText}>Pay using Bank transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#7900f2' }]}
          onPress={() => alert('Chức năng thanh toán chưa được hỗ trợ.')}>
          <Text style={styles.buttonText}>Buy now, pay later</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#7900f2' }]}
          onPress={handleCashOnDelivery}
        >
          <Text style={styles.buttonText}>Cash on Delivery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});