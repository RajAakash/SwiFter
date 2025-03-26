import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import io from "socket.io-client";

export default function UserRideStatusScreen({ route }) {
    const { rideId } = route.params;
    const [status, setStatus] = useState("pending");
    const socket = io("http://localhost:5000");

    useEffect(() => {
        socket.on("rideCompleted", (data) => {
            if (data.rideId === rideId) {
                Alert.alert(
                    "Ride Completed",
                    "Your ride has been completed by the driver."
                );
                setStatus("completed");
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text>Ride ID: {rideId}</Text>
            <Text>Status: {status}</Text>
        </View>
    );
}
