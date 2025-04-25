import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectLocation({ navigation }) {
  const [location, setLocation] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRides = async () => {
    console.log('fetching rides for location');
    try {
      setLoading(true);
      const res = await fetch(
        `http://192.168.0.134:3000/api/ride/search?location=${
          location || 'Austin'
        }`
      );
      const data = await res.json();
      if (data.success) {
        setRides(data.rides);
      } else {
        Alert.alert('Error', data.message || 'No rides found');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRide = async (rideId) => {
    try {
      const driverId = await AsyncStorage.getItem('userId'); // ensure this is saved at login
      if (!driverId) {
        Alert.alert('Error', 'Driver not logged in');
        return;
      }

      const res = await fetch(
        `http://192.168.0.134:3000/api/ride/assign/${rideId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ driverId }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        Alert.alert(
          'Ride Assigned!',
          'You’ve successfully selected this ride.'
        );
      } else {
        Alert.alert('Error', data.message || 'Could not assign ride.');
      }
    } catch (err) {
      console.error('Assign Ride Error:', err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Rides by Location</Text>
      <TextInput
        placeholder='Enter location (default: Texas)'
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <Button title='Search Rides' onPress={fetchRides} />

      {loading ? (
        <ActivityIndicator
          size='large'
          color='#0000ff'
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.rideCard}>
              {console.log('item I got', item)}
              <Text>Pickup: {item.pickup}</Text>
              <Text>Dropoff: {item.dropoff}</Text>
              <Text>Time: {new Date(item.bookingTime).toLocaleString()}</Text>
              <Button
                title='Select Ride'
                onPress={() => handleSelectRide(item._id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  rideCard: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
});
