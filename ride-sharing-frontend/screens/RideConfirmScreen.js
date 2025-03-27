import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

export default function RideConfirmScreen({ route }) {
  const { pickup, dropoff, pickupCoords, dropoffCoords, datetime } =
    route.params;

  // Function to handle the confirmation of a ride
  const handleConfirmRide = async () => {
    try {
      // Send a POST request to the backend to book a ride
      const response = await fetch('http://localhost:5000/api/ride/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          dropoff,
          pickupCoords,
          dropoffCoords,
          bookingTime: datetime,
          userId: 'user-id-placeholder', // Replace with real user id from auth
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Ride booked successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to book ride');
      }
    } catch (err) {
      Alert.alert('Network error', 'Could not connect to backend');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pickupCoords.latitude,
          longitude: pickupCoords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker title='Pickup' coordinate={pickupCoords} />
        <Marker title='Dropoff' coordinate={dropoffCoords} />
        <Polyline coordinates={[pickupCoords, dropoffCoords]} strokeWidth={4} />
      </MapView>
      <View style={{ padding: 10 }}>
        <Text>Pickup: {pickup}</Text>
        <Text>Dropoff: {dropoff}</Text>
        <Text>Scheduled: {new Date(datetime).toLocaleString()}</Text>
        <Button title='Confirm Ride' onPress={handleConfirmRide} />
      </View>
    </View>
  );
}
