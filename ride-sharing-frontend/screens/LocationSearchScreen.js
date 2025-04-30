import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LocationSearchScreen({ navigation }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const MAPBOX_TOKEN =
    'pk.eyJ1IjoiYWFrYXNoMDFyYWoiLCJhIjoiY205OWM4YzR6MDMyeTJxcHdwcTBvOHRlYyJ9.1G8UFTHICUJJqfIyvu2SGQ';

  const getCoordinates = async (address) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    if (data?.features?.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    } else {
      throw new Error('Address not found');
    }
  };

  const getRoute = async (pickupCoords, dropoffCoords) => {
    const { latitude: lat1, longitude: lon1 } = pickupCoords;
    const { latitude: lat2, longitude: lon2 } = dropoffCoords;

    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${lon1},${lat1};${lon2},${lat2}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    if (data.routes?.length > 0) {
      return data.routes[0].geometry;
    } else {
      throw new Error('Route not found');
    }
  };

  const handleNext = async () => {
    try {
      const pickupCoords = await getCoordinates(pickup);
      const dropoffCoords = await getCoordinates(dropoff);
      const route = await getRoute(pickupCoords, dropoffCoords);

      navigation.navigate('RideConfirm', {
        pickup,
        dropoff,
        pickupCoords,
        dropoffCoords,
        datetime,
        route,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Ride Details</Text>

      <TextInput
        placeholder='Pickup Location'
        value={pickup}
        onChangeText={setPickup}
        style={styles.input}
      />

      <TextInput
        placeholder='Dropoff Location'
        value={dropoff}
        onChangeText={setDropoff}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.buttonText}>Pick Date & Time</Text>
      </TouchableOpacity>

      <Text style={styles.dateText}>Selected: {datetime.toLocaleString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={datetime}
          mode='datetime'
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDatetime(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#a7f3d0',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4ade80',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  dateText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#065f46',
    textAlign: 'center',
  },
});
