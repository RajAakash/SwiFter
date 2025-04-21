import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { setIsAuthenticated } = useAuth();
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://192.168.0.134:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('user that is logged in', data);
      await AsyncStorage.setItem('userId', data.user._id);
      if (data.success) {
        alert('Login successful');
        setIsAuthenticated(true);
        setUser(data.user);
        navigation.navigate('Home');
      } else {
        alert('Login failed');
      }
    } catch (e) {
      console.log('Error here', e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title='Log In' onPress={handleLogin} />
    </View>
  );
}
