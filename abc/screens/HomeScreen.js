import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const screenWidth = Dimensions.get('window').width;

const brands = ['Vivo', 'Samsung', 'iPhone', 'Oppo'];
const featuredImage = require('../assets/Banner.png');

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id, // dùng duy nhất doc.id
        };
      });
      
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 50 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>E-shop</Text>
          <Text style={{ color: '#666' }}>5,000+ products and categories.</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
            <Ionicons name="heart-outline" size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
            <View style={{
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16
      }}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search products, brands..."
          style={{ marginLeft: 8, flex: 1, fontSize: 16 }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="options-outline" size={20} color="#999" />
      </View>


      {/* Brands */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {brands.map((brand, index) => (
          <View key={index} style={{ alignItems: 'center' }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Image
                source={require('../assets/iphone13.png')}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ fontSize: 12 }}>{brand}</Text>
          </View>
        ))}
      </View>

      {/* Banner */}
      <View style={{
        width: '100%',
        height: 150,
        backgroundColor: '#f3f3f3',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>40% off</Text>
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>on select sales.</Text>
          <TouchableOpacity style={{ backgroundColor: 'black', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' }}>
            <Text style={{ color: 'white', fontSize: 14 }}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={featuredImage}
          style={{
            width: 150,
            height: 130,
            marginRight: 40,
          }}
          resizeMode="contain"
        />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 30 }} />
      )}

      {/* Product List */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
      }}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={{
              width: (screenWidth - 48) / 2,
              borderRadius: 16,
              backgroundColor: '#f2f2f2',
              padding: 12,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
          >
            <Image
              source={{ uri: product.image }}
              style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontWeight: '600', fontSize: 14, textAlign: 'center', marginBottom: 4 }}>
              {product.name}
            </Text>
            <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
              {product.price.toLocaleString()} VNĐ
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
