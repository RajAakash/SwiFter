import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

export default function OnboardingScreen({ navigation }) {
  // Animation for fading in
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../assets/onboarding.png')}
          style={styles.image}
        />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        SwiFter
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Pre-book your rides at a cheaper price
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Anytime, Anywhere
      </Animated.Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7', // Soft background color
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30, // Spacing from the text
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2a2a2a', // Dark gray for better contrast
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 30, // Increased margin for spacing
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 70, // Size of the circular button
    height: 70, // Size of the circular button
    backgroundColor: '#008631', // Button color
    borderRadius: 35, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
});
