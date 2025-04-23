// components/SearchBar.tsx
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  /** giá trị hiện tại  */
  value: string;
  /** callback khi text thay đổi  */
  onChangeText: (txt: string) => void;
  /** placeholder tuỳ chọn  */
  placeholder?: string;
}

const SearchBar: React.FC<Props> = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      {/* icon tìm kiếm */}
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />

      {/* input controlled -> nhận value & onChangeText TỪ props  */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        returnKeyType="search"
      />

      {/* nút xoá chỉ hiển thị khi có chữ */}
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clear}
        >
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

/* ------------ styles ------------ */
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  icon: { marginRight: 6 },
  input: { flex: 1, fontSize: 15, color: "#000" },
  clear: { marginLeft: 6 },
});
