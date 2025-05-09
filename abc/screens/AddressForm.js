import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAddress } from '../context/AddressContext';
import { Ionicons } from '@expo/vector-icons';

export default function AddressForm() {
  const navigation = useNavigation();
  const { addresses, setAddresses, setSelectedAddress } = useAddress();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');

  const provinceList = [
    { label: 'TP. Hồ Chí Minh', value: 'hcm' },
    { label: 'Hà Nội', value: 'hn' },
  ];

  const districts = {
    hcm: [
      { label: 'Quận 1', value: 'q1' },
      { label: 'Quận 2', value: 'q2' },
    ],
    hn: [
      { label: 'Bắc Từ Liêm', value: 'bd' },
      { label: 'Cầu Giấy', value: 'hk' },
    ],
  };

  const wards = {
    q1: [
      { label: 'Phường Bến Nghé', value: 'bn' },
      { label: 'Phường Đa Kao', value: 'dk' },
    ],
    q2: [{ label: 'Thảo Điền', value: 'td' }],
    bd: [
      { label: 'Phường Cổ Nhuế 1', value: 'cn1' },
      { label: 'Phường Cổ Nhuế 2', value: 'cn2' },
    ],
    hk: [
      { label: 'Phường Mai Dịch', value: 'hb' },
      { label: 'Phường Dịch Vọng', value: 'dv' },
    ],
  };

  const handleSave = () => {
    if (!fullName || !phone || !province || !district || !ward || !detail) {
      setError('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }

    const newAddress = {
      fullName,
      phone,
      detail,
      province: provinceList.find(p => p.value === province)?.label || province,
      district: districts[province]?.find(d => d.value === district)?.label || district,
      ward: wards[district]?.find(w => w.value === ward)?.label || ward,
    };

    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thêm địa chỉ</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Nhập họ và tên"
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Nhập số điện thoại"
          />

          <Text style={styles.label}>Tỉnh / Thành phố</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={province}
              onValueChange={(itemValue) => {
                setProvince(itemValue);
                setDistrict('');
                setWard('');
              }}
              itemStyle={{ fontSize: 15 }}
            >
              <Picker.Item label="Chọn tỉnh / thành phố" value="" />
              {provinceList.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Quận / Huyện</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={district}
              enabled={!!province}
              onValueChange={(itemValue) => {
                setDistrict(itemValue);
                setWard('');
              }}
              itemStyle={{ fontSize: 15 }}
            >
              <Picker.Item label="Chọn quận / huyện" value="" />
              {(districts[province] || []).map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Phường / Xã</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ward}
              enabled={!!district}
              onValueChange={(itemValue) => setWard(itemValue)}
              itemStyle={{ fontSize: 15 }}
            >
              <Picker.Item label="Chọn phường / xã" value="" />
              {(wards[district] || []).map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Số nhà, tên đường</Text>
          <TextInput
            value={detail}
            onChangeText={setDetail}
            style={styles.input}
            placeholder="Nhập địa chỉ chi tiết"
          />

          {error !== '' && (
            <Text style={{ color: 'red', marginBottom: 12, fontWeight: '500' }}>{error}</Text>
          )}

          <TouchableOpacity onPress={handleSave} style={styles.button}>
            <Text style={styles.buttonText}>Lưu địa chỉ</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 4,
    height: 44,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});