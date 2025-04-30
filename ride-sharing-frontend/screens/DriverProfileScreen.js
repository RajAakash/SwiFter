import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

export default function DriverProfileScreen({ navigation }) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDriverProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const driverId = await AsyncStorage.getItem('userId');

      const res = await fetch(
        `${API_BASE_URL}/api/driver/profile/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setDriver(data.driver);
      } else {
        Alert.alert('Error', 'Failed to load profile');
      }
    } catch (err) {
      console.error('Failed to fetch driver profile:', err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!driver) {
    return (
      <View style={styles.container}>
        <Text>No driver profile found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>

      <View style={styles.profileCard}>
        <Image
          source={require('../assets/profile.png')} // <-- your uploaded image path
          style={styles.profileImage}
        />
        <Text style={styles.driverName}>{driver.name}</Text>
      </View>

      {/* Info Sections */}
      <View style={styles.infoCard}>
        <Image source={require('../assets/email(1).png')} style={styles.icon} />
        <Text style={styles.infoText0}>Email</Text>
        <Text style={styles.infoText}>{driver.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image
          source={require('../assets/telephone.png')}
          style={styles.icon}
        />
        <Text style={styles.infoText0}>Phone</Text>
        <Text style={styles.infoText}>{driver.phone}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image
          source={require('../assets/electric-car.png')}
          style={styles.icon}
        />
        <Text style={styles.infoText0}>Vehicle</Text>
        <Text style={styles.infoText}>{driver.vehicle}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image
          source={require('../assets/drivers-license.png')}
          style={styles.icon}
        />
        <Text style={styles.infoText0}>License</Text>
        <Text style={styles.infoText}>{driver.license}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image source={require('../assets/money(1).png')} style={styles.icon} />
        <Text style={styles.infoText0}>Earnings</Text>
        <Text style={styles.infoText}>${driver.totalEarnings}</Text>
      </View>
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
  profileCard: {
    backgroundColor: '#DFF3EC',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9FBF1',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between', // Ensure space between label and value
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  infoText0: {
    fontSize: 16,
    fontWeight: '600',
    width: 100, // Fixed width for label to keep things in sync
  },
  infoText: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right', // Align value text to the right if you want it aligned uniformly
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
