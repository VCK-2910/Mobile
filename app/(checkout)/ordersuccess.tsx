import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const OrderSuccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Đặt hàng thành công!</Text>
      <Text style={styles.message}>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ sớm được giao.</Text>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/(tabs)/Cart")}>
        <Text style={styles.homeText}>Quay về</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#2c3e50",
      textAlign: "center",
      marginBottom: 15,
    },
    message: {
      fontSize: 16,
      textAlign: "center",
      color: "#555",
      marginBottom: 25,
    },
    homeButton: {
      backgroundColor: "#007bff",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25,
    },
    homeText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
  });
  

export default OrderSuccess;
