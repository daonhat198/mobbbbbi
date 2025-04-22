import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sau khi đăng xuất, người dùng sẽ tự động được chuyển về màn hình đăng nhập
        // nhờ logic trong App.js
      })
      .catch((error) => console.error('Lỗi đăng xuất:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản</Text>
      <Text style={styles.subtitle}>Email: {user?.email || 'Khách'}</Text>
      {user && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EB144C" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#EB144C',
    marginLeft: 8,
  },
});