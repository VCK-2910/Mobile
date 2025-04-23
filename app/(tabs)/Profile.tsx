
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "@/lib/firebase";
import { useGlobalContext } from "../../context/GloballProvider";
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
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

  const menuItems = [
    {
      icon: "person-outline",
      label: "Thông tin cá nhân",
      action: () => router.push("/(profile)/update"),
      color: "#4A90E2"
    },
    {
      icon: "lock-closed-outline",
      label: "Đổi mật khẩu",
      action: () => router.push("/(profile)/password"),
      color: "#F5A623"
    },
    {
      icon: "receipt-outline",
      label: "Lịch sử đơn hàng",
      action: () => router.push("/(profile)/history"),
      color: "#50E3C2"
    },
    {
      icon: "calendar-outline",
      label: "Lịch sử đặt bàn",
      action: () => router.push("/(profile)/historybooking"),
      color: "#E86C60"
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <LinearGradient
          colors={['#0B3B5D', '#1E5B8D']}
          style={styles.header}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.name}>{profile?.username || 'User'}</Text>
            <Text style={styles.email}>{profile?.email || ''}</Text>
          </View>
        </LinearGradient>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#FFF" />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    paddingBottom: 40,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#0B3B5D",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  menuContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "#E74C3C",
    marginLeft: 15,
    fontWeight: "500",
  },
});

export default ProfileScreen;
