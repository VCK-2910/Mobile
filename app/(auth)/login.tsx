// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GloballProvider";
import { login } from "@/lib/firebase";            // ← dùng Firebase
import CustomButton from "@/components/CustomButton";

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const submit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // login trả về UserCredential
      const cred = await login(email.trim(), password);
      const user = cred.user;
      // cập nhật global state
      setUser(user);
      setIsLogged?.(true);
      router.replace("/Home");
    } catch (err: any) {
      // hiển thị thông báo từ Firebase
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/mini_logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <CustomButton
        title="Sign In"
        handlePress={submit}
        containerStyles={styles.button}
        isLoading={isSubmitting}
      />

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => Alert.alert("Chưa triển khai Google Sign-In")}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.signupText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  googleButton: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
  },
  signupText: {
    fontSize: 16,
    color: "#007bff",
    marginTop: 10,
  },
});
