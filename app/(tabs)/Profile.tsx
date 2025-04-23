// app/(profile)/ProfileScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CardFlip from "../../components/cardflip";
import ProfileCard from "../../components/profilecard";
import QRCard from "../../components/qrcard";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "@/lib/firebase";   // từ file firebase.js
import { useGlobalContext } from "../../context/GloballProvider";

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, profile, setUser } = useGlobalContext();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.replace("/(auth)/login");
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Thông tin của bạn</Text>

      <CardFlip frontComponent={<ProfileCard />} backComponent={<QRCard />} />

      <Text style={styles.tapText}>Nhấn vào thẻ để tích điểm</Text>

      {[
        { icon: "person",      label: "Cập nhật thông tin", action: () => router.push("/(profile)/update") },
        { icon: "lock-closed", label: "Thay đổi mật khẩu", action: () => router.push("/(profile)/password") },
        { icon: "time",        label: "Lịch sử thanh toán", action: () => router.push("/(profile)/history") },
        { icon: "calendar",    label: "Lịch sử đặt bàn", action: () => router.push("/(profile)/historybooking") },
        { icon: "log-out",     label: "Đăng xuất",         action: handleLogout },
      ].map((opt, idx, arr) => (
        <TouchableOpacity
          key={opt.label}
          style={[styles.option, idx === arr.length - 1 && styles.lastOption]}
          onPress={opt.action}
        >
          <Ionicons name={opt.icon as any} size={20} color="black" />
          <Text style={styles.optionText}>{opt.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header:    { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  username:  { fontSize: 18, textAlign: "center", color: "#555", marginBottom: 16 },
  tapText:   { textAlign: "center", color: "gray", marginVertical: 10 },
  option:    {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  optionText: { flex: 1, fontSize: 16, marginLeft: 12 },
  lastOption: { borderBottomWidth: 1 },
});
