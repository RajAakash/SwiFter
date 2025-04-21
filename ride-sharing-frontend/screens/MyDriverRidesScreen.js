import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';

export default function MyDriverRidesScreen({ route }) {
  const [rides, setRides] = useState([]);
  const { driverId } = route.params;

  useEffect(() => {
    fetchDriverRides();
  }, []);

  const fetchDriverRides = async () => {
    const res = await fetch(
      `http://192.168.0.134:3000/api/ride/my-rides/${driverId}`
    );
    const data = await res.json();
    setRides(data.rides);
  };

  const markAsCompleted = async (rideId) => {
    const res = await fetch(
      `http://192.168.0.134:3000/api/ride/complete/${rideId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = await res.json();
    if (data.success) {
      Alert.alert('Ride marked as completed');
      fetchDriverRides();
    } else {
      Alert.alert('Error', data.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 10, padding: 10, borderWidth: 1 }}>
      <Text>From: {item.pickup}</Text>
      <Text>To: {item.dropoff}</Text>
      <Text>Time: {new Date(item.bookingTime).toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
      {item.status === 'accepted' && (
        <Button
          title='Mark as Completed'
          onPress={() => markAsCompleted(item._id)}
        />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>My Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}
