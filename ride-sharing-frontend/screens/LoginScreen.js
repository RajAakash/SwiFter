import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

export default function LoginScreen({ navigation }) {
  const [isDriver, setIsDriver] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();

  const [scale] = useState(new Animated.Value(1));

  // Function to animate button press
  const animatePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    try {
      const endpoint = isDriver
        ? `${API_BASE_URL}/api/driver/login`
        : `${API_BASE_URL}/api/auth/login`;
      // const endpoint = isDriver
      //   ? 'http://192.168.0.151:3000/api/driver/login'
      //   : 'http://192.168.0.151:3000/api/auth/login';

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      {/* Toggle Buttons */}
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isDriver ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsDriver(false)}
        >
          <Text style={styles.toggleButtonText}>User Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            isDriver ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsDriver(true)}
        >
          <Text style={styles.toggleButtonText}>Driver Login</Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      {/* Animated Log In Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={handleLogin}
      >
        <Animated.Text
          style={[styles.loginButtonText, { transform: [{ scale }] }]}
        >
          Log In
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  toggleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  inactiveButton: {
    backgroundColor: '#ccc',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  inputField: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#008631',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
