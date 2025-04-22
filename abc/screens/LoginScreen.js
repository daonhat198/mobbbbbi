import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('✅ Đăng nhập thành công');
      })
      .catch((error) => {
        console.log('❌ Lỗi đăng nhập:', error.message);
        alert('Sai email hoặc mật khẩu!');
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 24, backgroundColor: 'white', justifyContent: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 32 }}>
            Welcome Back!
          </Text>

          {/* Email input */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 12,
              marginBottom: 16,
            }}
          >
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              placeholder="Username or Email"
              style={{ flex: 1, marginLeft: 8, height: 48 }}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password input */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 12,
              marginBottom: 8,
            }}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={{ flex: 1, marginLeft: 8, height: 48 }}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
            <Text style={{ color: '#f06292' }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#f06292',
              padding: 16,
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>

          {/* OR */}
          <Text style={{ textAlign: 'center', marginVertical: 24, color: '#666' }}>
            – OR Continue with –
          </Text>

          {/* Social login buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
            {[
                'https://img.icons8.com/color/48/google-logo.png',
                'https://img.icons8.com/ios-filled/50/000000/mac-os.png',
                'https://img.icons8.com/color/48/facebook.png',
            ].map((uri, index) => (
              <View
                key={index}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 1.5,
                  borderColor: '#f06292',
                  backgroundColor: '#fff0f5',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image source={{ uri }} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
              </View>
            ))}
          </View>

          {/* Sign up */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ color: '#333' }}>Create An Account </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ color: 'red' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
