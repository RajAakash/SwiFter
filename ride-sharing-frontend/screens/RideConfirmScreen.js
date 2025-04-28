import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useAuth } from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RideConfirmScreen({ route, navigation }) {
  const {
    pickup,
    dropoff,
    pickupCoords,
    dropoffCoords,
    datetime,
    route: routeGeoJSON,
  } = route.params;

  const handleConfirmRide = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch('http://192.168.0.151:3000/api/ride/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          dropoff,
          pickupCoords,
          dropoffCoords,
          bookingTime: datetime,
          userId: userId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Ride booked successfully');
        navigation.navigate('UserRideStatus');
      } else {
        Alert.alert('Error', data.message || 'Failed to book ride');
      }
    } catch (err) {
      Alert.alert('Network error', 'Could not connect to backend');
    }
  };

  const polylineCoords = routeGeoJSON.coordinates.map(
    ([longitude, latitude]) => ({
      latitude,
      longitude,
    })
  );

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
        <Polyline
          coordinates={polylineCoords}
          strokeWidth={4}
          strokeColor='blue'
        />
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
