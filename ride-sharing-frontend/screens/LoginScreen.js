import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [isDriver, setIsDriver] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      const endpoint = isDriver
        ? 'http://192.168.0.151:3000/api/driver/login'
        : 'http://192.168.0.151:3000/api/auth/login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        Alert.alert('Login failed', data.message || 'Check your credentials');
        return;
      }

      const userId = isDriver ? data.driver._id : data.user._id;

      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userToken', data.token);
      Alert.alert('Login successful');
      setIsAuthenticated(true);
      await AsyncStorage.setItem('userRole', isDriver ? 'driver' : 'user');
      await AsyncStorage.setItem(
        'userName',
        isDriver ? data.driver.name : data.user.name
      );
      if (isDriver) {
        navigation.navigate('DriverHome');
      } else {
        navigation.navigate('Home');
      }
    } catch (e) {
      console.error('Login error:', e);
      Alert.alert('Error', 'Something went wrong during login.');
    }
  };

  useEffect(() => {
    console.log('IsDriver status', isDriver);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {/* Toggle Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: !isDriver ? '#4CAF50' : '#ccc',
            padding: 10,
            marginRight: 5,
            borderRadius: 5,
          }}
          onPress={() => setIsDriver(false)}
        >
          <Text style={{ textAlign: 'center', color: 'white' }}>
            User Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: isDriver ? '#4CAF50' : '#ccc',
            padding: 10,
            marginLeft: 5,
            borderRadius: 5,
          }}
          onPress={() => setIsDriver(true)}
        >
          <Text style={{ textAlign: 'center', color: 'white' }}>
            Driver Login
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20 }}
      />
      <Button title='Log In' onPress={handleLogin} />
    </View>
  );
}
