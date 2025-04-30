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
import { API_BASE_URL } from '@env';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      if (!userId || !token) return;

      const res = await fetch(
        `${API_BASE_URL}/api/auth/user/${userId}/profile`,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileCard}>
        <Image
          source={require('../assets/Profile_1.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{profile.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image source={require('../assets/email(1).png')} style={styles.icon} />
        <Text style={styles.infoText0}>Email</Text>
        <Text style={styles.infoText}>{profile.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image source={require('../assets/money(1).png')} style={styles.icon} />
        <Text style={styles.infoText0}>Total Rides</Text>
        <Text style={styles.infoText}>{profile.totalRides}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image source={require('../assets/check.png')} style={styles.icon} />
        <Text style={styles.infoText0}>Completed</Text>
        <Text style={styles.infoText}>{profile.completedRides}</Text>
      </View>

      <View style={styles.infoCard}>
        <Image source={require('../assets/cancel.png')} style={styles.icon} />
        <Text style={styles.infoText0}>Cancelled</Text>
        <Text style={styles.infoText}>{profile.cancelledRides}</Text>
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
  userName: {
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
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  infoText0: {
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  infoText: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
