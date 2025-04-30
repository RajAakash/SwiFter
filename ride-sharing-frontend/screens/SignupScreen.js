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
import { API_BASE_URL } from '@env';
export default function SignupScreen({ navigation }) {
  const [isDriver, setIsDriver] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Driver-specific fields
  const [license, setLicense] = useState('');
  const [vehicle, setVehicle] = useState('');

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

  const handleSignup = async () => {
    try {
      const endpoint = isDriver
        ? `${API_BASE_URL}/api/driver/signup`
        : `${API_BASE_URL}/api/auth/signup`;

      const payload = isDriver
        ? { name, email, phone, vehicle, license, password }
        : { name, email, phone, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      Alert.alert(
        data.success ? 'Success' : 'Error',
        data.message || 'Signup response received'
      );

      if (data.success) navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error('Signup error:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      {/* Toggle Buttons */}
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isDriver ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsDriver(false)}
        >
          <Text style={styles.toggleButtonText}>Normal User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            isDriver ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsDriver(true)}
        >
          <Text style={styles.toggleButtonText}>Driver</Text>
        </TouchableOpacity>
      </View>

      {/* Common Fields */}
      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName}
        style={styles.inputField}
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
      />
      <TextInput
        placeholder='Phone'
        value={phone}
        onChangeText={setPhone}
        style={styles.inputField}
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      {/* Driver-specific Fields */}
      {isDriver && (
        <>
          <TextInput
            placeholder='Driver License Number'
            value={license}
            onChangeText={setLicense}
            style={styles.inputField}
          />
          <TextInput
            placeholder='Vehicle Number'
            value={vehicle}
            onChangeText={setVehicle}
            style={styles.inputField}
          />
        </>
      )}

      {/* Animated Sign Up Button */}
      <TouchableOpacity
        style={styles.signupButton}
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={handleSignup}
      >
        <Animated.Text
          style={[styles.signupButtonText, { transform: [{ scale }] }]}
        >
          Sign Up
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
  signupButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#008631',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
