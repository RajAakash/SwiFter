import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';

export default function AvailableRidesScreen({ route, navigation }) {
  const [rides, setRides] = useState([]);
  const { driverId } = route.params;

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const fetchAvailableRides = async () => {
    const res = await fetch('http://192.168.0.151:3000/api/ride/available');
    const data = await res.json();
    const userId = await AsyncStorage.getItem('userId');
    setRides(data.rides);
  };

  const acceptRide = async (rideId) => {
    const res = await fetch(
      `http://192.168.0.151:3000/api/ride/accept/${rideId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      }
    );
    const data = await res.json();
    if (data.success) {
      Alert.alert('Ride Accepted');
      fetchAvailableRides();
    } else {
      Alert.alert('Error', data.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 10, padding: 10, borderWidth: 1 }}>
      <Text>From: {item.pickup}</Text>
      <Text>To: {item.dropoff}</Text>
      <Text>Time: {new Date(item.bookingTime).toLocaleString()}</Text>
      <Button title='Accept Ride' onPress={() => acceptRide(item._id)} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Available Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}
