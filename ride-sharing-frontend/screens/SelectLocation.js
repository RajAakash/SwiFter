import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
export default function SelectLocation({ navigation }) {
  const [location, setLocation] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/ride/search?location=${location || 'Austin'}`
      );
      const data = await res.json();
      if (data.success) {
        setRides(data.rides);
        setSelectedRideId(null);
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
      const driverId = await AsyncStorage.getItem('userId');
      if (!driverId) {
        Alert.alert('Error', 'Driver not logged in');
        return;
      }

      const res = await fetch(
        `http://192.168.0.151:3000/api/ride/assign/${rideId}`,
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
        setSelectedRideId(rideId);
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
      <Text style={styles.heading}>Search Rides</Text>
      <TextInput
        placeholder='Enter location (default: Austin)'
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <TouchableOpacity style={styles.searchButton} onPress={fetchRides}>
        <Text style={styles.searchButtonText}>Search Rides</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size='large'
          color='#34D399'
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const isAssigned = item.isAssigned;
            const isSelected = item._id === selectedRideId;
            const shouldDisable = isAssigned || isSelected;

            return (
              <View style={styles.rideCard}>
                <Text style={styles.label}>Pickup:</Text>
                <Text style={styles.value}>{item.pickup}</Text>

                <Text style={styles.label}>Dropoff:</Text>
                <Text style={styles.value}>{item.dropoff}</Text>

                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>
                  {new Date(item.bookingTime).toLocaleString()}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    shouldDisable && styles.disabledButton,
                  ]}
                  onPress={() => handleSelectRide(item._id)}
                  disabled={shouldDisable}
                >
                  <Text style={styles.buttonText}>
                    {isAssigned
                      ? 'Already Assigned'
                      : isSelected
                      ? 'Ride Selected'
                      : 'Select Ride'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f1f5f9', // light background
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#34D399', // light green border
  },
  searchButton: {
    backgroundColor: '#00ab41',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rideCard: {
    backgroundColor: '#DFF3EC',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#008631',
  },
  value: {
    marginBottom: 8,
    fontSize: 16,
    color: '#0f172a',
  },
  selectButton: {
    backgroundColor: '#34D399', // green
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6ee7b7', // gray for disabled
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
