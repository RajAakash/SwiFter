import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

export default function DriverEarnings() {
  const [loading, setLoading] = useState(true);
  const [completedRides, setCompletedRides] = useState([]);

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(
          `${API_BASE_URL}/api/ride/driver/${userId}/completed-rides`
        );
        const data = await res.json();
        if (data.success) {
          setCompletedRides(data.rides);
        }
      } catch (err) {
        console.error('Error fetching completed rides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRides();
  }, []);

  const rideCount = completedRides.length;
  const totalEarnings = rideCount * 5;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings Summary</Text>

      <View style={styles.earningsCard}>
        <Image source={require('../assets/money(1).png')} style={styles.icon} />
        <Text style={styles.label}>Total Rides</Text>
        <Text style={styles.value}>{rideCount}</Text>
      </View>

      <View style={styles.earningsCard}>
        <Image source={require('../assets/money(1).png')} style={styles.icon} />
        <Text style={styles.label}>Total Earnings</Text>
        <Text style={styles.value}>${totalEarnings}</Text>
      </View>

      <View style={styles.earningsCard}>
        <Image source={require('../assets/money(1).png')} style={styles.icon} />
        <Text style={styles.label}>This Month</Text>
        <Text style={styles.value}>${totalEarnings}</Text>
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
  earningsCard: {
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 120,
  },
  value: {
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
