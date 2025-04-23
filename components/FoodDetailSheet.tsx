import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageSourcePropType,
} from "react-native";
import { useCart } from "../context/cartcontext";
import { FoodDoc } from "@/context/types";


interface FoodDetailSheetProps {
  item: FoodDoc;
}

export default function FoodDetailSheet({ item }: FoodDetailSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Lấy giá, mặc định 0 nếu undefined
  const priceNum = item.price ?? 0;

  const handleAddToCart = () => {
    addToCart({
      foodDocId: item.$id,
      name: item.namefood,
      price: priceNum,
      quantity,
      imageUrl: item.imageUrl ?? "",
    });
    Alert.alert("Thông báo", "Đã thêm vào giỏ hàng");
  };

  // Chuẩn hoá source cho Image
  // Chuẩn hóa thành ImageSourcePropType để <Image> hiểu
    let source: ImageSourcePropType;
    if (typeof item.imageUrl === "string") {
      source = { uri: item.imageUrl };
    } else {
      // number (require) hoặc object { uri: string }
      source = item.imageUrl as ImageSourcePropType;
    }
  return (
    <View style={styles.container}>
       {/* Luôn giữ lại vùng hình dù không có source */}
            {source ? (
              <Image source={source} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                {/* Bạn có thể đặt icon hoặc text nhỏ ở đây nếu muốn */}
              </View>
            )}
      <Text style={styles.name} numberOfLines={2}>
        {item.namefood}
      </Text>
      <Text style={styles.price}>
        {`₫${priceNum.toLocaleString()}`}
      </Text>

      <View style={styles.rowContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(q => Math.max(1, q - 1))}
            style={styles.quantityButton}
            activeOpacity={0.7}
          >
            <Text style={styles.quantityText}>–</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            onPress={() => setQuantity(q => q + 1)}
            style={styles.quantityButton}
            activeOpacity={0.7}
          >
            <Text style={styles.quantityText}>＋</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: "cover",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    color: "#ff5733",
    marginVertical: 8,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#0B3B5D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholder: {
    backgroundColor: "#f0f0f0",
  },
});
