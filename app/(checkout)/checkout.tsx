// checkout.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCart, CartItem } from "@/context/cartcontext";
import { Ionicons } from "@expo/vector-icons";


export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice } = useLocalSearchParams();
  let cartItems: CartItem[] = [];
  try {
    cartItems = JSON.parse(items as string) || [];
  } catch (error) {
    console.error("Invalid JSON in items:", error);
    cartItems = [];
  }
  const total = Number(totalPrice);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Tiền mặt" | "Chuyển khoản">("Tiền mặt");
  const { cart,removeFromCart } = useCart();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  console.log("Selected items:", cart);

  function toggleSelect(id: string) {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }


  const handleOrder = async () => {
    if (!phone || !address) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập số điện thoại và địa chỉ");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Bạn chưa đăng nhập");

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: JSON.stringify(cartItems),
        total,
        paymentMethod,
        phone,
        address,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      selectedItems.forEach(id => removeFromCart(id));
      console.log("Selected items(after):", cart);
      router.replace("/ordersuccess");
    } catch (e: any) {
      Alert.alert("Lỗi", e.message);
    }
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 0 }}>
          <Ionicons name="arrow-back-outline" size={20} />
        </TouchableOpacity>
        <Text style={[styles.header, { flex: 1, textAlign: "center" }]}>Xác nhận đơn hàng</Text>
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={it => it.foodDocId}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const isSel = selectedItems.includes(item.foodDocId);
          return (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>
                  {item.price.toLocaleString()}₫ x {item.quantity}
                </Text>
              </View>
            </View>
          );
        }}
        style={styles.list}
      />
      <View>
        <Text style={styles.total}>Tổng cộng: {total.toLocaleString()}₫</Text>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ giao hàng"
          value={address}
          onChangeText={setAddress}
          keyboardType="default"
        />

        <View style={styles.payMethods}>
          {["Tiền mặt", "Chuyển khoản"].map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.payBtn,
                paymentMethod === m && styles.payBtnActive,
              ]}
              onPress={() => setPaymentMethod(m as "Tiền mặt" | "Chuyển khoản")}
            >
              <Text
                style={[
                  styles.payText,
                  paymentMethod === m && { color: "#fff" },
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
          <Text style={styles.orderText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  list: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  total: { fontSize: 18, fontWeight: "bold", textAlign: "right", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  payMethods: { flexDirection: "row", marginBottom: 20 },
  payBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#0B3B5D",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  payBtnActive: { backgroundColor: "#0B3B5D" },
  payText: { color: "#0B3B5D", fontWeight: "600" },
  orderBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"},
  orderText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  image: { width: 50, height: 50, borderRadius: 8, marginRight: 8 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "500" },
  price: { fontSize: 14, color: "#555" },
});


