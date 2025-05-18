import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/lib/firebase";
import { fetchUserOrders, cancelOrder } from "@/lib/firebase";
import { Ionicons } from '@expo/vector-icons';
import { count } from "firebase/firestore";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: string;
  total: number;
  status: string;
  address: string;
  phone: string;
  paymentMethod: string;
  createdAt: { seconds: number; nanoseconds: number };
}

const HistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      setOrders(orders.map(order => 
        order.id === orderId 
          ? {...order, status: 'cancelled'} 
          : order
      ));
      Alert.alert('Thành công', 'Đã hủy đơn hàng');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
    }
  };
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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
  

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f1c40f';
      case 'paid': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0B3B5D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Lịch sử đơn hàng</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ccc" />
          <Text style={styles.empty}>Chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const parsed = JSON.parse(item.items) as OrderItem[];
            const dt = new Date(item.createdAt.seconds * 1000);
            const isExpanded = expandedOrder === item.id;

            return (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => toggleOrderDetails(item.id)}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.date}>{dt.toLocaleString()}</Text>
                    <Text style={styles.total}>
                      Tổng: {item.total.toLocaleString()}₫
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={styles.status}>{item.status}</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.details}>
                    {item.status !== 'cancelled' && item.status !== 'Paid' && (
                      <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => handleCancelOrder(item.id)}
                      >
                        <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.detailsHeader}>Chi tiết đơn hàng:</Text>
                    {parsed.map((orderItem, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>{orderItem.name}</Text>
                        <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
                        <Text style={styles.itemPrice}>
                          {(orderItem.price * orderItem.quantity).toLocaleString()}₫
                        </Text>
                      </View>
                    ))}
                    <View style={styles.deliveryInfo}>
                      <Text style={styles.detailsLabel}>Địa chỉ: {item.address}</Text>
                      <Text style={styles.detailsLabel}>SĐT: {item.phone}</Text>
                      <Text style={styles.detailsLabel}>
                        Thanh toán: {item.paymentMethod}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.expandButton}>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff"
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#0B3B5D"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  empty: { 
    textAlign: "center", 
    marginTop: 12, 
    color: "#666",
    fontSize: 16 
  },
  list: { 
    padding: 16
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  date: { 
    color: "#666",
    fontSize: 14
  },
  total: { 
    fontSize: 16, 
    fontWeight: "700",
    marginTop: 4,
    color: "#0B3B5D"
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  status: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize"
  },
  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },
  detailsHeader: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444"
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: "#444"
  },
  itemQuantity: {
    marginHorizontal: 16,
    color: "#666"
  },
  itemPrice: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500"
  },
  deliveryInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8
  },
  detailsLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4
  },
  expandButton: {
    alignItems: "center",
    marginTop: 8
  }
});