import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserRideStatusScreen() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUpcomingRides = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');

    try {
      setLoading(true);
      const res = await fetch(
        `http://192.168.0.134:3000/api/ride/upcoming/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setRides(data.rides);
      } else {
        console.warn('Failed to fetch upcoming rides');
      }
    } catch (err) {
      console.error('Error fetching upcoming rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async (rideId, bookingTime) => {
    const rideTime = new Date(bookingTime);
    const now = new Date();
    const diffInHours = (rideTime - now) / (1000 * 60 * 60);

    if (diffInHours < 2) {
      Alert.alert(
        'Cannot Cancel',
        'Ride is within 2 hours and cannot be cancelled.'
      );
      return;
    }

    Alert.alert('Cancel Ride', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(
              `http://192.168.0.134:3000/api/rides/cancel/${rideId}`,
              { method: 'POST' }
            );
            const data = await res.json();
            if (res.ok && data.success) {
              Alert.alert('Ride Cancelled');
              fetchUpcomingRides(); // Refresh
            } else {
              Alert.alert('Error', data.message);
            }
          } catch (err) {
            Alert.alert('Error', 'Could not cancel ride');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUpcomingRides();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text>From: {item.pickup}</Text>
      <Text>To: {item.dropoff}</Text>
      <Text>Time: {new Date(item.bookingTime).toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
      {item.status === 'booked' && (
        <Button
          title='Cancel Ride'
          color='red'
          onPress={() => handleCancelRide(item._id, item.bookingTime)}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchUpcomingRides}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
});
