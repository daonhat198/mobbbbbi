import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setSelectedColor(data.colors?.[0] || '#000');
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.log('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      color: selectedColor,
    });
    navigation.navigate('MainTabs', {
      screen: 'Cart',
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ padding: 16, paddingTop: 40 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Image
        source={{ uri: product.image }}
        style={{ width: '100%', height: 250, borderRadius: 16, marginBottom: 16 }}
        resizeMode="contain"
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{product.name}</Text>
      </View>

      <Text style={{ color: '#6B7280', marginBottom: 8 }}>{product.description}</Text>

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        {product.price.toLocaleString()} VNĐ
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Colors</Text>
          <View style={{ flexDirection: 'row' }}>
            {product.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedColor(color)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: color,
                  borderWidth: selectedColor === color ? 2 : 1,
                  borderColor: selectedColor === color ? 'black' : '#E5E7EB',
                  marginRight: 8,
                }}
              />
            ))}
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Quantity</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 6
          }}>
            <TouchableOpacity onPress={() => setQuantity(prev => Math.max(1, prev - 1))} style={{ padding: 8 }}>
              <Text style={{ fontSize: 18 }}>−</Text>
            </TouchableOpacity>
            <Text style={{ paddingHorizontal: 12 }}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 18 }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleAddToCart}
        style={{
          backgroundColor: 'black',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 16,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}