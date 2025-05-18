import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: any;
  userId: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = auth.currentUser;

  const fetchNotifications = async () => {
    if (!user) return;
    
    const q = query(
      collection(db, "noti"), 
      where("userId", "==", user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const notifs: Notification[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifs.push({
        id: doc.id,
        title: data.title,
        message: data.message,
        read: data.read,
        time: data.time,
        userId: data.userId
      });
    });
    
    // Sắp xếp thông báo với thông báo chưa đọc hiển thị đầu tiên
    notifs.sort((a, b) => {
      // Thông báo chưa đọc luôn lên đầu
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      // Sau đó sắp xếp theo thời gian, mới nhất lên đầu
      return b.time?.toDate() - a.time?.toDate();
    });
    
    setNotifications(notifs);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleNotificationPress = async (notification: Notification) => {
    try {
      const notifRef = doc(db, "noti", notification.id);
      if (!notification.read) {
        await updateDoc(notifRef, {
          read: true
        });
        
        // Cập nhật state để hiển thị notification đã đọc
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id 
              ? { ...n, read: true } 
              : n
          )
        );
      } else {
        // Nếu thông báo đã đọc, có thể xóa sau khi người dùng đã xem nội dung
        await deleteDoc(notifRef);
        
        // Xóa khỏi state
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }
    } catch (error) {
      console.error("Error handling notification:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông báo");
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.item, item.read ? styles.read : styles.unread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconWrapper}>
        <Ionicons 
          name={item.read ? "notifications-outline" : "notifications"} 
          size={24} 
          color={item.read ? "#777" : "#007bff"} 
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, !item.read && styles.boldTitle]}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>
          {new Date(item.time?.toDate()).toLocaleDateString()} {new Date(item.time?.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteNotification(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const notifRef = doc(db, "noti", notificationId);
      await deleteDoc(notifRef);
      
      // Xóa khỏi state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
      Alert.alert("Lỗi", "Không thể xóa thông báo");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.titlecontainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headertitle}>Thông báo</Text>
        <View style={styles.emptyView} />
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Không có thông báo nào</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16 
  },
  list: { 
    paddingHorizontal: 0, 
    paddingTop: 10 
  },
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
    fontWeight: '500',
    marginBottom: 2,
  },
  boldTitle: {
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
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
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headertitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyView: {
    width: 38, // Cân đối với backButton
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});