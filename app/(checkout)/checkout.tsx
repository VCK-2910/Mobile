import React, { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import * as Location from 'expo-location';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/lib/firebase";
import { CartItem, useCart } from "@/context/cartcontext";


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
  const [keyboardHeight, setKeyboardHeight] = useState(0);


  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setScrollEnabled(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
      setScrollEnabled(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

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
    if (!/^[0-9]{10}$/.test(phone)) {
          Alert.alert("Error", "Số điện thoại không hợp lệ");
          return;
    }
    if (address.trim().length < 5) {
    Alert.alert("Lỗi", "Vui lòng nhập địa chỉ hợp lệ");
    return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Bạn chưa đăng nhập");

      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: JSON.stringify(cartItems),
        total,
        paymentMethod,
        phone,
        address,
        status: paymentMethod === "Tiền mặt" ? "Paid" : "pending",
        createdAt: serverTimestamp(),
      });

      // Add notification for the order
      await addDoc(collection(db, "noti"), {
        userId: user.uid,
        title: `Đơn hàng #${Math.floor(Math.random() * 1000)} đã được đặt`,
        message: `Đơn hàng ${total.toLocaleString()}₫ - ${paymentMethod}`,
        time: serverTimestamp(),
        read: false,
        type: 'order'
      });
      
      // Remove selected items from cart
      cartItems.forEach(item => removeFromCart(item.foodDocId));
      console.log("Selected items(after):", cart);
      router.replace("/ordersuccess");
    } catch (e: any) {
      Alert.alert("Lỗi", e.message);
    }
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardHeight}
        style={{flex:1}}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name="arrow-back-outline" size={20} />
          </TouchableOpacity>
          <Text style={[styles.header, { flex: 1, textAlign: "center" }]}>Xác nhận đơn hàng</Text>
        </View>
        <FlatList
          data={cartItems}
          keyExtractor={it => it.foodDocId}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            return (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{item.price.toLocaleString()}₫ x {item.quantity}</Text>
                </View>
              </View>
            );
          }}
          style={styles.list}
        />
        <View style={{ paddingBottom: keyboardHeight }}> {/* Add padding to prevent keyboard from covering content */}
          <Text style={styles.total}>Tổng cộng: {total.toLocaleString()}₫</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            placeholderTextColor={"#999"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.addressInput}
              placeholder="Địa chỉ giao hàng"
              placeholderTextColor={"#999"}
              value={address}
              onChangeText={setAddress}
              keyboardType="default"
            />
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission denied', 'Không thể lấy vị trí hiện tại');
                  return;
                }

                let currentLocation = await Location.getCurrentPositionAsync({});
                let addressResponse = await Location.reverseGeocodeAsync({
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                });
                
                if (addressResponse[0]) {
                  const addr = addressResponse[0];
                  const fullAddress = [addr.name, addr.street, addr.district, addr.city, addr.region].filter(Boolean).join(", ");
                  setAddress(fullAddress);
                }
              }}
            >
              <Ionicons name="location" size={24} color="#0B3B5D" />
            </TouchableOpacity>
          </View>

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
      </KeyboardAvoidingView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  locationButton: {
    padding: 10,
    marginLeft: 8,
  },
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