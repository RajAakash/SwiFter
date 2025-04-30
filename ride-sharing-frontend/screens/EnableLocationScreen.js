import React from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';

export default function EnableLocationScreen({ navigation }) {
  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    navigation.navigate('LocationSearch', {
      currentLocation: location.coords,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Your Location</Text>
      <TouchableOpacity style={styles.button} onPress={requestLocation}>
        <Text style={styles.buttonText}>Use My Location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('LocationSearch')}
      >
        <Text style={styles.secondaryButtonText}>Use Other Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // light greenish background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1c4532',
  },
  button: {
    backgroundColor: '#4ade80', // green button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#d1fae5', // soft mint background
  },
  secondaryButtonText: {
    color: '#065f46', // darker green
    textAlign: 'center',
    fontWeight: '600',
  },
});
