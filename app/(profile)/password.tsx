// app/(profile)/password.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const auth = getAuth();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường.");
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    if (newPwd.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu mới phải ít nhất 8 ký tự.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert("Lỗi", "Không tìm thấy người dùng.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Tạo credential từ email + mật khẩu hiện tại
      const cred = EmailAuthProvider.credential(user.email, currentPwd);
      // 2️⃣ Xác thực lại
      await reauthenticateWithCredential(user, cred);
      // 3️⃣ Cập nhật mật khẩu
      await updatePassword(user, newPwd);

      Alert.alert("Thành công", "Đổi mật khẩu thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.log("Change password error:", err);
      Alert.alert("Lỗi", err.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Thay đổi mật khẩu</Text>

      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#888"
        secureTextEntry
        value={currentPwd}
        onChangeText={setCurrentPwd}
      />

      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Ít nhất 8 ký tự"
        placeholderTextColor="#888"
        secureTextEntry
        value={newPwd}
        onChangeText={setNewPwd}
      />

      <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPwd}
        onChangeText={setConfirmPwd}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleChange}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang xử lý..." : "Lưu thay đổi"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#0B3B5D",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
