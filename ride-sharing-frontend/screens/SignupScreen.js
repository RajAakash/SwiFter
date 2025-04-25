import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function SignupScreen({ navigation }) {
  const [isDriver, setIsDriver] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Driver-specific fields
  const [license, setLicense] = useState('');
  const [vehicle, setVehicle] = useState('');

  const handleSignup = async () => {
    try {
      const endpoint = isDriver
        ? 'http://192.168.0.134:3000/api/driver/signup'
        : 'http://192.168.0.134:3000/api/auth/signup';

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
            Normal User
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
          <Text style={{ textAlign: 'center', color: 'white' }}>Driver</Text>
        </TouchableOpacity>
      </View>

      {/* Common Fields */}
      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder='Phone'
        value={phone}
        onChangeText={setPhone}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />

      {/* Driver-specific Fields */}
      {isDriver && (
        <>
          <TextInput
            placeholder='Driver License Number'
            value={license}
            onChangeText={setLicense}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            placeholder='Vehicle Number'
            value={vehicle}
            onChangeText={setVehicle}
            style={{ marginBottom: 10 }}
          />
        </>
      )}

      <Button title='Sign Up' onPress={handleSignup} />
    </View>
  );
}
