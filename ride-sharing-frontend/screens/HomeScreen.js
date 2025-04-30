import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/auth-context';

export default function HomeScreen({ navigation, route }) {
  const { setIsAuthenticated, setUser } = useAuth();
  const rideId = route?.params?.rideId;

  const [scale] = React.useState(new Animated.Value(1));

  const animatePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');

      setIsAuthenticated(false);
      setUser(null);

      navigation.replace('Welcome');
    } catch (error) {
      Alert.alert('Error', 'There was an issue logging out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <View style={styles.grid}>
        {/* Box 1 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => navigation.navigate('EnableLocation')}
          >
            <Image
              source={require('../assets/car_icon.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>Book a New Ride</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Box 2 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => navigation.navigate('UserRideStatus', { rideId })}
          >
            <Image
              source={require('../assets/motorbike.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>View My Rides</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Box 3 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => navigation.navigate('RideHistory')}
          >
            <Image
              source={require('../assets/bike.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>Ride History</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Box 4 */}
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.boxContent}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={require('../assets/profile.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>My Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#D32F2F' }]}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    width: '48%',
    aspectRatio: 1, // Makes it square
    backgroundColor: '#DFF3EC', // Light blue like your screenshot
    borderWidth: 1,
    borderColor: '#4ade80', // Border color
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  boxContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  image: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  logoutButtonContainer: {
    marginTop: 30,
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
