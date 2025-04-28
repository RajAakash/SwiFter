import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const [scale] = React.useState(new Animated.Value(1));

  // Function to animate button press
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>
      <Text style={styles.subHeading}>Have a better sharing experience</Text>

      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={() => navigation.navigate('Signup')}
      >
        <Animated.Text style={[styles.buttonText, { transform: [{ scale }] }]}>
          Create an account
        </Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={() => navigation.navigate('Login')}
      >
        <Animated.Text style={[styles.buttonText, { transform: [{ scale }] }]}>
          Log In
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9', // Soft background color
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#008631',
  },
  loginButton: {
    backgroundColor: '#4B6043',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
