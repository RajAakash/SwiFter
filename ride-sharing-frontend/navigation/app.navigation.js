import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/auth-context/auth-context.js';

import OnboardingScreen from '../screens/OnboardingScreen.js';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import EnableLocationScreen from '../screens/EnableLocationScreen';
import LocationSearchScreen from '../screens/LocationSearchScreen.js';
import RideConfirmScreen from '../screens/RideConfirmScreen';
import DriverLoginScreen from '../screens/DriverLoginScreen';
import AvailableRidesScreen from '../screens/AvailableRidesScreen';
import MyDriverRidesScreen from '../screens/MyDriverRidesScreen';
import DriverStatsScreen from '../screens/DriverStatsScreen';
import UserRideStatusScreen from '../screens/UserRideStatusScreen';
import AdminRidePanelScreen from '../screens/AdminRidePanelScreen';
import HomeScreen from '../screens/HomeScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen.js';

const Stack = createStackNavigator();

export const AppNavigation = () => {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated:', isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Welcome'} // Ensure Welcome is the default screen if not authenticated
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen
              name='EnableLocation'
              component={EnableLocationScreen}
            />
            <Stack.Screen
              name='LocationSearch'
              component={LocationSearchScreen}
            />
            <Stack.Screen name='RideConfirm' component={RideConfirmScreen} />
            <Stack.Screen name='DriverLogin' component={DriverLoginScreen} />
            <Stack.Screen
              name='AvailableRides'
              component={AvailableRidesScreen}
            />
            <Stack.Screen
              name='MyDriverRides'
              component={MyDriverRidesScreen}
            />
            <Stack.Screen name='RideHistory' component={RideHistoryScreen} />
            <Stack.Screen name='DriverStats' component={DriverStatsScreen} />
            <Stack.Screen
              name='UserRideStatus'
              component={UserRideStatusScreen}
            />
            <Stack.Screen
              name='AdminRidePanel'
              component={AdminRidePanelScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name='Onboarding'
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Welcome'
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
