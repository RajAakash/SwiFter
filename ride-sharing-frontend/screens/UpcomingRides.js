import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
export default function UpcomingRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcoming = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch(
        `${API_BASE_URL}/api/ride/driver/${userId}/upcoming-rides`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setRides(data.rides);
      }
    } catch (e) {
      console.error('Error fetching upcoming rides:', e);
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (rideId) => {
    try {
      const res = await fetch(
        `http://192.168.0.151:3000/api/ride/driver/complete/${rideId}`,
        {
          method: 'PUT',
        }
      );
      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Ride marked as completed');
        fetchUpcoming(); // Refresh list
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to complete ride');
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Rides</Text>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : rides.length === 0 ? (
        <Text style={styles.noRidesText}>No upcoming rides found.</Text>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.ride}>
              <Text>Pickup: {item.pickup}</Text>
              <Text>Dropoff: {item.dropoff}</Text>
              <Text>Time: {new Date(item.bookingTime).toLocaleString()}</Text>
              <Text>Status: {item.status}</Text>
              {item.status !== 'completed' && (
                <Button
                  title='✅ Complete Rides'
                  onPress={() => completeRide(item._id)}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  ride: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
