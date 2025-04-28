import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      if (!userId || !token) return;

      const res = await fetch(
        `http://192.168.0.151:3000/api/auth/user/${userId}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setProfile(data.profile);
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      Alert.alert('Error', 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Image source={require('../assets/Profile_1.jpg')} style={styles.image} />
      <Text style={styles.heading}>👤 My Profile</Text>
      <Text style={styles.info}>Name: {profile.name}</Text>
      <Text style={styles.info}>Email: {profile.email}</Text>
      <Text style={styles.info}>Total Rides: {profile.totalRides}</Text>
      <Text style={styles.info}>Completed: ✅ {profile.completedRides}</Text>
      <Text style={styles.info}>Cancelled: ❌ {profile.cancelledRides}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});
