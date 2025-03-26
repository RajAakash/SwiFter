import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./screens/OnboardingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import EnableLocationScreen from "./screens/EnableLocationScreen";
import LocationSearchScreen from "./screens/LocationSearchScreen.js";
import RideConfirmScreen from "./screens/RideConfirmScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EnableLocation"
                    component={EnableLocationScreen}
                />
                <Stack.Screen
                    name="LocationSearch"
                    component={LocationSearchScreen}
                />
                <Stack.Screen
                    name="RideConfirm"
                    component={RideConfirmScreen}
                />
                <Stack.Screen
                    name="DriverLogin"
                    component={DriverLoginScreen}
                />
                <Stack.Screen
                    name="AvailableRides"
                    component={AvailableRidesScreen}
                />
                <Stack.Screen
                    name="MyDriverRides"
                    component={MyDriverRidesScreen}
                />
                <Stack.Screen
                    name="DriverStats"
                    component={DriverStatsScreen}
                />
                <Stack.Screen
                    name="UserRideStatus"
                    component={UserRideStatusScreen}
                />
                <Stack.Screen
                    name="AdminRidePanel"
                    component={AdminRidePanelScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
