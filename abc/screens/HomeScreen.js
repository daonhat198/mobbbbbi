import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const screenWidth = Dimensions.get('window').width;

const brands = ['All', 'Vivo', 'Samsung', 'iPhone', 'Oppo'];
const featuredImage = require('../assets/Banner.png');

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [visibleProductsCount, setVisibleProductsCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { cart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        };
      });
      setProducts(productList);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrand === 'All' || product.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleLoadMore = () => {
    if (isLoadingMore || visibleProductsCount >= filteredProducts.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProductsCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 1000);
  };

  const visibleProducts = filteredProducts.slice(0, visibleProductsCount);

  const renderItem = ({ item }) => {
    const isWishlisted = wishlist.some((wishlistItem) => wishlistItem.id === item.id);

    return (
      <TouchableOpacity
        style={{
          width: (screenWidth - 48) / 2,
          borderRadius: 16,
          backgroundColor: '#f2f2f2',
          padding: 12,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 8 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontWeight: '600',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
          {item.price.toLocaleString()} VNĐ
        </Text>
        <TouchableOpacity
          style={{ position: 'absolute', top: 12, right: 12 }}
          onPress={() => {
            if (isWishlisted) {
              removeFromWishlist(item.id);
            } else {
              addToWishlist(item);
            }
          }}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderBanner = () => (
    <View
      style={{
        width: '100%',
        height: 150,
        backgroundColor: '#f3f3f3',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>40% off</Text>
        <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
          on select sales.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'black',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            alignSelf: 'flex-start',
          }}
        >
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
  );

  const renderHeader = () => (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        {brands.map((brand, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: 'center',
              opacity: selectedBrand === brand ? 1 : 0.6,
            }}
            onPress={() => {
              setSelectedBrand(brand);
              setVisibleProductsCount(8);
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: selectedBrand === brand ? '#000' : '#ccc',
                marginBottom: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/iphone13.png')}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ fontSize: 12, fontWeight: selectedBrand === brand ? 'bold' : 'normal' }}>
              {brand}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderBanner()}
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 50 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>E-shop</Text>
          <Text style={{ color: '#666' }}>5,000+ products and categories.</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
            <View style={{ position: 'relative' }}>
              <Ionicons name="heart-outline" size={22} />
              {wishlist.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {wishlist.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <View style={{ position: 'relative' }}>
              <Ionicons name="cart-outline" size={22} />
              {cart.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {cart.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#f2f2f2',
          borderRadius: 12,
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: '#ddd',
          marginBottom: 16,
        }}
      >
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search products, brands..."
          style={{ marginLeft: 8, flex: 1, fontSize: 16 }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="options-outline" size={20} color="#999" />
      </View>
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          !loading && isLoadingMore ? (
            <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}