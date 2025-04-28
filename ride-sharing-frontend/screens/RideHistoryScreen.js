import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RideHistoryScreen() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId'); // save this at login time too
      if (!userId) return;

      const res = await fetch(
        `http://192.168.0.151:3000/api/ride/history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) setRides(data.rides);
    };

    fetchRides();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text>From: {item.pickup}</Text>
      <Text>To: {item.dropoff}</Text>
      <Text>Time: {new Date(item.bookingTime).toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
