// app/(tabs)/Notifications.tsx
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notificationsData: Notification[] = [
  { id: '1', title: 'Đơn hàng #123 đã được gửi', message: 'Đơn hàng của bạn đang được vận chuyển.', time: '2 giờ trước', read: false },
  { id: '2', title: 'Khuyến mãi mới', message: 'Giảm 20% cho mọi đơn từ ₫200.000.', time: '1 ngày trước', read: true },
  { id: '3', title: 'Cập nhật menu', message: 'Thêm món “Bò Mỹ” vào danh sách.', time: '3 ngày trước', read: true },
  // ... thêm thông báo ở đây
];

export default function NotificationsScreen() {
  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={[styles.item, item.read ? styles.read : styles.unread]}>
      <View style={styles.iconWrapper}>
        <Ionicons 
          name={item.read ? "notifications-outline" : "notifications"} 
          size={24} 
          color={item.read ? "#777" : "#007bff"} 
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.titlecontainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headertitle}>Thông báo    </Text>
      </View>
      <FlatList
        data={notificationsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff',padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  list: { paddingHorizontal: 0, paddingTop: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  unread: {
    backgroundColor: '#f0f8ff',
  },
  read: {
    backgroundColor: '#fff',
  },
  iconWrapper: {
    width: 36,
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  titlecontainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", },
  backButton: {
    padding: 0, 
  },
  headertitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", flex:1}, // Added title style
});
