import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/auth-context';

export default function DriverHome({ navigation }) {
  const [driverName, setDriverName] = useState('');
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated } = useAuth();
  const [scale] = useState(new Animated.Value(1));

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#007bff' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {driverName || 'Driver'}!!!</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>

      <View style={styles.grid}>
        {/* Box 1 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => handleNavigate('SelectLocation')}
          >
            <Image
              source={require('../assets/location.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>Select Location</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Box 2 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => handleNavigate('UpcomingRides')}
          >
            <Image
              source={require('../assets/calendar.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>Upcoming Rides</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Box 3 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => handleNavigate('DriverEarnings')}
          >
            <Image
              source={require('../assets/money.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>Your Earnings</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Box 4 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => handleNavigate('DriverProfile')}
          >
            <Image
              source={require('../assets/profile.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>Your Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Logout Button */}
      <View style={{ marginTop: 30, width: '100%' }}>
        <Button title='Log Out' onPress={handleLogout} color='#d9534f' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#e0f7fa',
    borderWidth: 1,
    borderColor: '#00bcd4',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  boxContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  image: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
