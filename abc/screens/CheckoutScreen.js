import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { selectedAddress } = useAddress();
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItems } = route.params;

  const handleContinue = () => {
    if (
      !selectedAddress ||
      !selectedAddress.fullName ||
      !selectedAddress.phone ||
      !selectedAddress.province ||
      !selectedAddress.district ||
      !selectedAddress.ward ||
      !selectedAddress.detail
    ) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn địa chỉ giao hàng.');
      return;
    }

    navigation.navigate('Payment', { selectedItems });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        {/* Shipping Address */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Shipping address</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddressList')}>
            <Text style={{ color: '#007bff', fontWeight: '500' }}>Thay đổi</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addressBox}>
          <Text style={styles.addressName}>{selectedAddress?.fullName || 'Chưa có tên'}</Text>
          <Text style={styles.addressDetail}>
            {selectedAddress
              ? `${selectedAddress.detail}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
              : 'Chưa có địa chỉ'}
          </Text>
        </View>

        {/* Order list */}
        <Text style={styles.sectionTitle}>Order list</Text>
        {selectedItems.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 16 }}>
            Không có sản phẩm nào được chọn
          </Text>
        ) : (
          selectedItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  {item.price.toLocaleString()} VNĐ
                </Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                    <Text style={styles.quantityBtn}>−</Text>
                  </TouchableOpacity>
                  <Text>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <Text style={styles.quantityBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue to payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  sectionTitle: {
    fontWeight: '500',
    color: '#555',
    fontSize: 16,
  },
  addressBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  addressName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressDetail: {
    color: '#555',
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  itemName: {
    fontWeight: '600',
  },
  itemPrice: {
    color: '#333',
    marginVertical: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityBtn: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 6,
    textAlign: 'center',
    width: 24,
  },
  continueBtn: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
  },
});