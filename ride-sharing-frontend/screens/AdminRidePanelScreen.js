import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';

export default function AdminRidePanelScreen() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchAllRides();
  }, []);

  const fetchAllRides = async () => {
    const res = await fetch('http://192.168.0.134:3000/api/ride/all');
    const data = await res.json();
    setRides(data.rides);
  };

  const deleteRide = async (rideId) => {
    const res = await fetch(`http://192.168.0.134:3000/api/ride/${rideId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      Alert.alert('Ride Deleted');
      fetchAllRides();
    } else {
      Alert.alert('Error', data.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 10, padding: 10, borderWidth: 1 }}>
      <Text>User: {item.userId}</Text>
      <Text>Pickup: {item.pickup}</Text>
      <Text>Dropoff: {item.dropoff}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Driver: {item.driver ? item.driver : 'Unassigned'}</Text>
      <Button title='Delete Ride' onPress={() => deleteRide(item._id)} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Admin Ride Panel</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}
