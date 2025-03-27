import React, { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";

export default function EnableLocationScreen({ navigation }) {
    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Location access is required.");
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        navigation.navigate("LocationSearch", {
            currentLocation: location.coords,
        });
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Enable your location</Text>
            <Button title="Use my location" onPress={requestLocation} />
            <Button
                title="Use other location"
                onPress={() => navigation.navigate("LocationSearch")}
            />
        </View>
    );
}
