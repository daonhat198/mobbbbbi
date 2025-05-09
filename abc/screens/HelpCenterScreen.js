import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpCenterScreen() {
  const navigation = useNavigation();

  const helpOptions = [
    {
      title: 'Câu hỏi thường gặp',
      icon: 'help-circle-outline',
      action: () => Alert.alert('Thông báo', 'Chức năng đang phát triển'),
    },
    {
      title: 'Chính sách đổi trả',
      icon: 'document-text-outline',
      action: () => Alert.alert('Thông báo', 'Chức năng đang phát triển'),
    },
    {
      title: 'Liên hệ hỗ trợ',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:0983385873'),
    },
    {
      title: 'Gửi email góp ý',
      icon: 'mail-outline',
      action: () => Linking.openURL('laonhi198@gmail.com'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Trung tâm trợ giúp</Text>
        <View style={{ width: 24 }} />
      </View>

      {helpOptions.map((option, index) => (
        <TouchableOpacity key={index} style={styles.item} onPress={option.action}>
          <Ionicons name={option.icon} size={24} color="#333" style={{ marginRight: 12 }} />
          <Text style={styles.itemText}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
