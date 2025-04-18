import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const rideId = route?.params?.rideId;
  console.log('HomeScreen rideId:', rideId);

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
            rideId: 'test123',
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
