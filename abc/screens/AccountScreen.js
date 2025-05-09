import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      navigation.replace('Login');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name={user?.photoURL ? 'person-circle' : 'person-circle-outline'}
            size={100}
            color="#333"
          />
        </View>
        <Text style={styles.name}>{user?.displayName || user?.email?.split('@')[0] || 'Người dùng'}</Text>

        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate('PersonalInfo')}
        >
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Thông tin cá nhân</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate('AddressList')}
        >
          <Ionicons name="location-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Địa chỉ giao hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Trung tâm trợ giúp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Ionicons name="cart-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Đơn hàng</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  optionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});