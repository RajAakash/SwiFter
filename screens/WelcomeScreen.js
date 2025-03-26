import React from "react";
import { View, Text, Button } from "react-native";

export default function WelcomeScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text style={{ fontSize: 24 }}>Welcome</Text>
            <Text>Have a better sharing experience</Text>
            <Button
                title="Create an account"
                onPress={() => navigation.navigate("Signup")}
            />
            <Button
                title="Log In"
                onPress={() => navigation.navigate("Login")}
            />
        </View>
    );
}
