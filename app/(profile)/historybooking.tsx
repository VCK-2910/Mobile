// app/(profile)/BookingHistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, fetchUserBookings } from '@/lib/firebase';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = auth.currentUser?.uid; 

  useEffect(() => {
    if (!uid) return setLoading(false);
    fetchUserBookings(uid)
      .then(list => setBookings(list))
      .catch(err => console.error('Error fetching bookings:', err))
      .finally(() => setLoading(false));
  }, [uid]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Booking ID: {item.id}</Text>
      <Text style={styles.cardText}>Ngày: {item.date}</Text>
      <Text style={styles.cardText}>Giờ: {item.time}</Text>
      <Text style={styles.cardText}>Số khách: {item.guests}</Text>
      <Text style={styles.cardText}>Trạng thái: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.titlecontainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#333" />
    </TouchableOpacity>
            <Text style={styles.title}>Thông tin đặt hàng</Text>
        </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0B3B5D" />
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="clock" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có lịch sử đặt bàn</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0B3B5D', marginBottom: 16, textAlign: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#333', marginBottom: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#666', marginTop: 12 },
  titlecontainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 20  },
  backButton: {
    padding: 0, 
  },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", flex:1}, // Added title style
});
