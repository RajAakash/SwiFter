import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) navigation.navigate("Login");
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Sign Up" onPress={handleSignup} />
        </View>
    );
}
