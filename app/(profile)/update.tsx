// app/(profile)/update.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GloballProvider";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function UpdateProfileScreen() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { user, refreshProfile } = useGlobalContext();
  // Load current user info
  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Lỗi", "Chưa đăng nhập.");
        router.back();
        return;
      }
      // Pre-fill from Auth
      setName(user.displayName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "");

      // Và từ Firestore (nếu bạn có thêm trường custom)
      const userDocRef = doc(db, "users", user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.username) setName(data.username);
        // nếu có các trường khác, map ở đây...
      }

      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đủ tên và email.");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser!;
      // 1️⃣ Cập nhật displayName trong Firebase Auth
      if (name.trim() !== user.displayName) {
        await updateProfile(user, { displayName: name.trim() });
      }
      // 2️⃣ Cập nhật email nếu thay đổi (Firebase sẽ tự hỏi lại đăng nhập nếu cần)
      if (email.trim() !== user.email) {
        await updateEmail(user, email.trim());
      }
      // 3️⃣ Cập nhật số điện thoại nếu thay đổi (Firebase không hỗ trợ trực tiếp, cập nhật trong Firestore)
      if (phone.trim() !== user.phoneNumber) {
        console.warn("Firebase Auth không hỗ trợ cập nhật phoneNumber trực tiếp. Sẽ cập nhật trong Firestore.");
      }
      
      // 3️⃣ Cập nhật document trong Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          username: name.trim(),
          email: email.trim(),
          phoneNumber: phone.trim(),
          updatedAt: new Date(),
        },
        { merge: true }
      );
      await refreshProfile(); // Refresh lại profile từ Firestore
      Alert
      .alert("Thành công", "Đã cập nhật thông tin.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error("Update profile error:", err);
      Alert.alert("Lỗi", err.message || "Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0B3B5D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Cập nhật thông tin</Text>
      </View>

      <Text style={styles.label}>Tên hiển thị</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên của bạn"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        keyboardType="email-address"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Phonenumber</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: { fontSize: 16, marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0B3B5D",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#888" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
