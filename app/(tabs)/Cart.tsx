// Cart.tsx
import React, { useRef, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart, CartItem } from "../../context/cartcontext";

export default function CartScreen() {
  const { cart, removeFromCart, decreaseQuantity, increaseQuantity } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  // Toggle chọn / bỏ chọn
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Lấy danh sách món đã chọn
  const selectedItems = useMemo(
    () => cart.filter(item => selectedIds.includes(item.foodDocId)),
    [cart, selectedIds]
  );
  const totalSelected = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [selectedItems]
  );

  const handleCheckout = () => {
    if (!selectedItems.length) {
      Alert.alert("Chưa chọn món", 
        "Vui lòng tích chọn ít nhất một món để thanh toán.");
      return;
    }
    // Đưa qua màn Checkout
    router.push({
      pathname: "/checkout",
      params: {
        items: JSON.stringify(selectedItems),
        totalPrice: totalSelected.toString()
      }
    });
    // Clear selected items after navigation
    setSelectedIds([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.header}>Giỏ hàng</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.foodDocId}
          renderItem={({ item }) => {
            const isSel = selectedIds.includes(item.foodDocId);
            return (
              <View style={styles.cartItem}>
                <TouchableOpacity onPress={() => toggleSelect(item.foodDocId)}>
                  <Ionicons
                    name={isSel ? "radio-button-on" : "radio-button-off"}
                    size={24}
                    color={isSel ? "#0B3B5D" : "#888"}
                  />
                </TouchableOpacity>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    {item.price.toLocaleString()}₫ x {item.quantity}
                  </Text>
                </View>
                <View style={styles.qtyCtr}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.foodDocId)}>
                    <Ionicons name="remove-circle-outline" size={22} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item)}>
                    <Ionicons name="add-circle-outline" size={22} color="#333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.foodDocId)}>
                  <Ionicons name="trash" size={22} color="#f44" />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {!!selectedItems.length && (
        <View style={styles.checkoutBar}>
          <Text style={styles.total}>Tổng: {totalSelected.toLocaleString()}₫</Text>
          <TouchableOpacity style={styles.btn} onPress={handleCheckout}>
            <Text style={styles.btnText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#999" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  image: { width: 50, height: 50, borderRadius: 6, marginHorizontal: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "500" },
  price: { fontSize: 14, color: "#555" },
  qtyCtr: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  qty: { marginHorizontal: 6, fontSize: 16 },
  checkoutBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  total: { flex: 1, fontSize: 18, fontWeight: "bold" },
  btn: {
    backgroundColor: "#0B3B5D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
