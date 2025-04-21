import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/auth-context';

export default function HomeScreen({ navigation, route }) {
  const { setIsAuthenticated, setUser } = useAuth();
  const rideId = route?.params?.rideId;
  console.log('HomeScreen rideId:', rideId);

  const handleLogout = async () => {
    try {
      // Clear the user data and token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      console.log('This is logout');

      // Update AuthContext to reflect the user is logged out
      setIsAuthenticated(false);
      setUser(null);

      // Navigate to Welcome screen after logout
      navigation.replace('Welcome'); // This will navigate to the WelcomeScreen
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'There was an issue logging out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SwiFter 🚗</Text>

      <Button
        title='📍 Book a New Ride'
        onPress={() => navigation.navigate('EnableLocation')}
      />
      <Button
        title='📋 View My Rides'
        onPress={() =>
          navigation.navigate('UserRideStatus', {
            rideId: rideId,
            scheduledTime: '2025-04-15T18:00:00Z', // use a future time!
          })
        }
      />
      <Button
        title='🧾 Ride History'
        onPress={() => navigation.navigate('RideHistory')}
      />
      <Button
        title='👤 My Profile'
        onPress={() => navigation.navigate('Profile')}
      />

      <Button
        title='🚪 Logout'
        onPress={handleLogout}
        color='red' // Make the button stand out
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
});
