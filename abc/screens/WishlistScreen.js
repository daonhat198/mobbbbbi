import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useWishlist } from '../context/WishlistContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 60, paddingHorizontal: 16 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>My Wishlist</Text>
      {wishlist.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#9CA3AF' }}>Your wishlist is empty</Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
              style={{
                width: '48%',
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 8,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 8 }}
                resizeMode="contain"
              />
              <Text numberOfLines={1} style={{ fontWeight: '600', marginBottom: 4 }}>
                {item.name}
              </Text>
              <Text style={{ color: '#6B7280', marginBottom: 8 }}>
                {item.price.toLocaleString()} VNĐ
              </Text>
              <TouchableOpacity
                onPress={() => removeFromWishlist(item.id)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <Ionicons name="heart" size={20} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}