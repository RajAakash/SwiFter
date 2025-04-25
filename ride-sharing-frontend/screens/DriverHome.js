import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/auth-context';

export default function DriverHome({ navigation }) {
  const [driverName, setDriverName] = useState('');
  const [loading, setLoading] = useState(true);

  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const loadDriverInfo = async () => {
      const name = await AsyncStorage.getItem('userName');
      if (name) setDriverName(name);
      setLoading(false);
    };
    loadDriverInfo();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsAuthenticated(false);
    navigation.navigate('Login');
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {driverName || 'Driver'}!!!</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleNavigate('SelectLocation')}
      >
        <Text style={styles.menuText}>🚗 Select Location to See Rides</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleNavigate('UpcomingRides')}
      >
        <Text style={styles.menuText}>📅 See Upcoming Rides</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleNavigate('DriverEarnings')}
      >
        <Text style={styles.menuText}>💰 Your Earnings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleNavigate('DriverEarnings')}
      >
        <Text style={styles.menuText}>💰 Your Profile</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30 }}>
        <Button title='Log Out' onPress={handleLogout} color='#d9534f' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  menuButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
