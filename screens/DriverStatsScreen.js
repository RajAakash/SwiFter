import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DriverStatsScreen({ route }) {
    const { driverId } = route.params;
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const res = await fetch(
            `http://localhost:5000/api/ride/driver-summary/${driverId}`
        );
        const data = await res.json();
        setSummary(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Driver Summary</Text>
            {summary ? (
                <View style={styles.box}>
                    <Text>Total Rides: {summary.total}</Text>
                    <Text>Accepted Rides: {summary.accepted}</Text>
                    <Text>Completed Rides: {summary.completed}</Text>
                    <Text>Pending Rides: {summary.pending}</Text>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    box: { padding: 20, borderWidth: 1, width: "100%" },
});
