// app/(profile)/history.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/lib/firebase";
import { fetchUserOrders } from "@/lib/firebase";

interface Order {
  id: string;
  items: string;     // JSON string
  total: number;
  status: string;
  createdAt: { seconds: number; nanoseconds: number };
}

const HistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }

      try {
        const data = await fetchUserOrders(user.uid);
        setOrders(data as Order[]);
      } catch (e) {
        console.error("Fetch orders failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0B3B5D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Lịch sử thanh toán</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>Chưa có đơn hàng nào</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const parsed = JSON.parse(item.items);
            const dt = new Date(item.createdAt.seconds * 1000);
            return (
              <View style={styles.card}>
                <Text style={styles.date}>{dt.toLocaleString()}</Text>
                <Text style={styles.total}>
                  Tổng: {item.total.toLocaleString()}₫
                </Text>
                <Text>Số món: {parsed.length}</Text>
                <Text>Trạng thái: {item.status}</Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center:    { flex: 1, justifyContent: "center", alignItems: "center" },
  header:    { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 12 },
  empty:     { textAlign: "center", marginTop: 20, color: "#555" },
  list:      { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#f7f7f7",
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
  },
  date:  { color: "#666", marginBottom: 4 },
  total: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
});
