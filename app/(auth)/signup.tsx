import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet,Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GloballProvider";
import { createUser } from "../../lib/firebase";
import CustomButton from "@/components/CustomButton";
import { isLoading } from "expo-font";

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setIsLogged } = useGlobalContext();

  const [loading,  setLoading]  = useState(false);
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const submit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;                                // ⬅️ thoát sớm
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const userDoc = await createUser(email, password, name);
      setUser(userDoc);
      setIsLogged?.(true);
      router.replace("/Home");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Sign‑up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/mini_logo.png")} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setUsername}
            />
      <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
      <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
      <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={loading}
      />
      <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.signupText}>Already have an account? Login</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
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
    marginBottom: 20,
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
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
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

