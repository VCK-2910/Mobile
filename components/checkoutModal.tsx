import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, FlatList, ScrollView 
} from "react-native";
import { Modalize } from "react-native-modalize";
import { RadioButton } from "react-native-paper";

interface CheckoutModalProps {
  modalizeRef: React.RefObject<Modalize>;
  totalPrice: number;
}

const storeLocations = [
  { id: "1", name: "Le Monde Steak - Tô Hiệu" },
  { id: "2", name: "Le Monde Steak - Trần Duy Hưng" },
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ modalizeRef, totalPrice }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedStore, setSelectedStore] = useState(storeLocations[0].name);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [distance, setDistance] = useState(1); // Giả định khoảng cách mặc định là 1km

  const vat = totalPrice * 0.08; // 8% thuế VAT
  const shippingFee = distance * 10000; // 10k/km
  const finalTotal = totalPrice + vat + shippingFee;

  return (
    <Modalize ref={modalizeRef} modalHeight={600}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Thông tin đặt hàng</Text>
        
        <Text style={styles.label}>Nhập số điện thoại:</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Nhập số điện thoại" 
            placeholderTextColor="#888"
            keyboardType="phone-pad" 
            value={phone} 
            onChangeText={setPhone} 
        />

        <Text style={styles.label}>Nhập địa chỉ:</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#888" 
            value={address} 
            onChangeText={setAddress} 
        />

        <Text style={styles.label}>Chọn địa điểm quán:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        <FlatList
          data={storeLocations}
          keyExtractor={(item) => item.id}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.storeItem, selectedStore === item.name && styles.selectedStore]} 
              onPress={() => setSelectedStore(item.name)}
            >
              <Text style={styles.storeText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        </ScrollView>
        <Text style={styles.label}>Chọn phương thức thanh toán:</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={styles.radioButton} 
            onPress={() => setPaymentMethod("Tiền mặt")}
          >
            <RadioButton 
              value="Tiền mặt" 
              status={paymentMethod === "Tiền mặt" ? "checked" : "unchecked"} 
              onPress={() => setPaymentMethod("Tiền mặt")} 
            />
            <Text style={styles.radioText}>Tiền mặt</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.radioButton} 
            onPress={() => setPaymentMethod("Chuyển khoản")}
          >
            <RadioButton 
              value="Chuyển khoản" 
              status={paymentMethod === "Chuyển khoản" ? "checked" : "unchecked"} 
              onPress={() => setPaymentMethod("Chuyển khoản")} 
            />
            <Text style={styles.radioText}>Chuyển khoản</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.summary}>Thành tiền: {totalPrice.toLocaleString()}₫</Text>
        <Text style={styles.summary}>Thuế (8% VAT): {vat.toLocaleString()}₫</Text>
        <Text style={styles.summary}>Phí ship ({distance} km): {shippingFee.toLocaleString()}₫</Text>
        <Text style={styles.totalFinal}>Tổng cộng: {finalTotal.toLocaleString()}₫</Text>

        <TouchableOpacity style={styles.orderButton} onPress={() => console.log("Đặt hàng thành công!")}>
          <Text style={styles.orderText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 15, borderRadius: 10, marginBottom: 10 },
  label: { fontWeight: "bold", marginTop: 10 },
  summary: { fontSize: 16, marginTop: 5 },
  totalFinal: { fontSize: 18, fontWeight: "bold", marginTop: 10, color: "#ff5733" },
  orderButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 30, alignItems: "center", marginTop: 20 },
  orderText: { fontSize: 16, fontWeight: "bold", color: "#fff" },

  storeItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedStore: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  storeText: {
    fontSize: 16,
    color: "#333",
  },

  radioContainer: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default CheckoutModal;
