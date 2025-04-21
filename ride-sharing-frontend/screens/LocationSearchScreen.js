import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, Platform } from 'react-native';
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
    if (data && data.features && data.features.length > 0) {
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
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry; // geojson format
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
        route, // pass route to next screen
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>Select address</Text>
      <TextInput
        placeholder='From'
        value={pickup}
        onChangeText={setPickup}
        style={{ marginVertical: 10 }}
      />
      <TextInput
        placeholder='To'
        value={dropoff}
        onChangeText={setDropoff}
        style={{ marginBottom: 20 }}
      />

      <Button title='Pick Date & Time' onPress={() => setShowPicker(true)} />
      <Text style={{ marginVertical: 10 }}>
        Selected: {datetime.toLocaleString()}
      </Text>
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

      <Button title='Next' onPress={handleNext} />
    </View>
  );
}
