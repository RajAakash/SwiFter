import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverEarnings() {
  const [loading, setLoading] = useState(true);
  const [completedRides, setCompletedRides] = useState([]);

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(
          `http://192.168.0.134:3000/api/ride/driver/${userId}/completed-rides`
        );
        const data = await res.json();
        if (data.success) {
          console.log(data);
          setCompletedRides(data.rides);
        }
      } catch (err) {
        console.error('Error fetching completed rides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRides();
  }, []);

  const rideCount = completedRides.length;
  const totalEarnings = rideCount * 5;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings Summary</Text>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          <Text style={styles.info}>Total Rides: {rideCount}</Text>
          <Text style={styles.info}>Total Earnings: ${totalEarnings}</Text>
          <Text style={styles.info}>This Month: ${totalEarnings}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f1f1' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  info: {
    fontSize: 18,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
