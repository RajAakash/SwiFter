import React from "react";
import { View, Text, Image, Button } from "react-native";

export default function OnboardingScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Image
                source={require("../assets/onboarding.png")}
                style={{ width: 300, height: 300 }}
            />
            <Text style={{ fontSize: 28, fontWeight: "bold" }}>SwiFter</Text>
            <Text>Pre-book your rides at cheaper price</Text>
            <Text>At anytime</Text>
            <Button title="Go" onPress={() => navigation.navigate("Welcome")} />
        </View>
    );
}
