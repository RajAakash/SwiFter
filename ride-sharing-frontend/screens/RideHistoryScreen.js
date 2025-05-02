import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

export default function RideHistoryScreen() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const res = await fetch(`${API_BASE_URL}/api/ride/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) setRides(data.rides);
      } catch (err) {
        console.error('Error fetching ride history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.rideCard}>
      <Image
        source={require('../assets/electric-car.png')}
        style={styles.icon}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item.pickup}</Text>

        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item.dropoff}</Text>

        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>
          {new Date(item.bookingTime).toLocaleString()}
        </Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{item.status}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E9FBF1',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
