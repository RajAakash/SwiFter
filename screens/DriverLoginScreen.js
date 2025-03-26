import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";

export default function DriverLoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/api/driver/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
            Alert.alert("Login Success", `Welcome ${data.driver.name}`);
            navigation.navigate("DriverDashboard", {
                driverId: data.driver._id,
            });
        } else {
            Alert.alert("Login Failed", data.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Driver Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 10 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 20 }}
            />
            <Button title="Log In" onPress={handleLogin} />
        </View>
    );
}
