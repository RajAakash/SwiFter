import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import io from 'socket.io-client';

export default function UserRideStatusScreen({ route }) {
  const { rideId, scheduledTime } = route?.params ?? {};

  const [status, setStatus] = useState('pending');
  const [canCancel, setCanCancel] = useState(false);
  const [loading, setLoading] = useState(false);

  const socket = io('http://192.168.0.123:3000');

  // --- Fetch Ride Status from Backend ---
  const fetchRideStatus = async () => {
    try {
      const res = await fetch(`http://192.168.0.123:3000/rides/${rideId}`);
      const data = await res.json();

      if (res.ok && data.status) {
        setStatus(data.status);
        checkIfCanCancel(data.scheduledTime);
      } else {
        console.warn('Could not fetch ride status.');
      }
    } catch (err) {
      console.error('Error fetching ride status:', err);
    }
  };

  // --- Check if ride can be cancelled based on scheduled time ---
  const checkIfCanCancel = (time) => {
    const rideTime = new Date(time ?? scheduledTime);
    const now = new Date();
    const timeDiff = (rideTime - now) / (1000 * 60 * 60); // in hours

    setCanCancel(timeDiff >= 2);
  };

  // --- Handle Cancel Ride ---
  const handleCancelRide = async () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            const res = await fetch(
              `http://192.168.0.123:3000/rides/${rideId}/cancel`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const data = await res.json();

            if (res.ok && data.success) {
              Alert.alert(
                'Ride Cancelled',
                data.message || 'Your ride was cancelled.'
              );
              await fetchRideStatus(); // <-- Refresh status after cancel
            } else {
              Alert.alert('Error', data.message || 'Failed to cancel ride.');
            }
          } catch (err) {
            console.error('Cancel Ride Error:', err);
            Alert.alert('Error', 'Could not cancel the ride.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (!rideId) return;

    // Load initial ride status from backend
    fetchRideStatus();

    // Set up socket listener for live updates
    socket.on('rideCompleted', (data) => {
      if (data.rideId === rideId) {
        Alert.alert(
          'Ride Completed',
          'Your ride has been completed by the driver.'
        );
        setStatus('completed');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [rideId]);

  return (
    <View style={{ padding: 20 }}>
      <Text>Ride ID: {rideId ?? 'Unknown'}</Text>
      <Text>Status: {status}</Text>
      <Text>
        Scheduled Time:{' '}
        {scheduledTime ? new Date(scheduledTime).toLocaleString() : 'N/A'}
      </Text>

      {canCancel && status === 'pending' && (
        <Button
          title={loading ? 'Cancelling...' : 'Cancel Ride'}
          color='red'
          onPress={handleCancelRide}
          disabled={loading}
        />
      )}
    </View>
  );
}
