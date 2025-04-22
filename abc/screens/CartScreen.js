import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState({});

  // Automatically select only new items when cart changes
  useEffect(() => {
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev };
      cart.forEach((item) => {
        // Only select items that are new (not in prev selectedItems)
        if (!(item.id in newSelectedItems)) {
          newSelectedItems[item.id] = true;
        }
      });
      // Remove selectedItems for items no longer in cart
      Object.keys(newSelectedItems).forEach((id) => {
        if (!cart.some((item) => item.id.toString() === id)) {
          delete newSelectedItems[id];
        }
      });
      return newSelectedItems;
    });
  }, [cart]);

  // Calculate total price of selected items
  const total = cart.reduce((sum, item) => {
    if (selectedItems[item.id]) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  // Handle selecting/deselecting an item
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Handle selecting/deselecting all items
  const toggleSelectAll = () => {
    const allSelected = cart.every((item) => selectedItems[item.id]);
    const newSelectedItems = {};
    cart.forEach((item) => {
      newSelectedItems[item.id] = !allSelected;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleCheckout = () => {
    // Filter selected items for checkout
    const itemsToCheckout = cart.filter((item) => selectedItems[item.id]);
    if (itemsToCheckout.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }
    // Pass selected items to Checkout screen
    navigation.navigate('Checkout', { selectedItems: itemsToCheckout });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>

          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
              <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.shopNowText}>Mua sắm ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Select All Checkbox */}
              <View style={styles.selectAllContainer}>
                <TouchableOpacity
                  onPress={toggleSelectAll}
                  style={styles.checkbox}
                >
                  <Ionicons
                    name={
                      cart.every((item) => selectedItems[item.id])
                        ? 'checkbox'
                        : 'square-outline'
                    }
                    size={24}
                    color="#1F2937"
                  />
                </TouchableOpacity>
                <Text style={styles.selectAllText}>Chọn tất cả</Text>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent}>
                {cart.map((item) => (
                  <View key={item.id.toString()} style={styles.cartItem}>
                    {/* Checkbox for each item */}
                    <TouchableOpacity
                      onPress={() => toggleItemSelection(item.id)}
                      style={styles.checkbox}
                    >
                      <Ionicons
                        name={selectedItems[item.id] ? 'checkbox' : 'square-outline'}
                        size={24}
                        color="#1F2937"
                      />
                    </TouchableOpacity>

                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>
                        {item.price.toLocaleString('vi-VN')} VNĐ
                      </Text>
                      {item.color && (
                        <View style={styles.colorContainer}>
                          <Text style={styles.colorLabel}>Màu:</Text>
                          <View
                            style={[styles.colorSwatch, { backgroundColor: item.color }]}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.footer}>
                <Text style={styles.totalText}>
                  Tổng giá: {total.toLocaleString('vi-VN')} VNĐ
                </Text>
                <TouchableOpacity
                  onPress={handleCheckout}
                  style={styles.checkoutButton}
                >
                  <Text style={styles.checkoutText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  shopNowButton: {
    backgroundColor: '#EB144C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shopNowText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectAllText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  checkbox: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1F2937',
  },
  itemPrice: {
    color: '#555',
    marginTop: 4,
    fontSize: 14,
  },
  colorContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginRight: 4,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D1D5DB',
    marginRight: 8,
    backgroundColor: 'white',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1F2937',
  },
  quantity: {
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  checkoutButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});