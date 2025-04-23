import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '@/context/GloballProvider';
import { getDocs, query, where } from 'firebase/firestore';
import { menuCol } from '@/lib/firebase';

const { width } = Dimensions.get('window');

interface Food {
  id: string;
  namefood: string;
  imageUrl?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useGlobalContext();
  const [specialFoods, setSpecialFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userName = profile?.username || 'Khách';

  const handleBookingPress = () => {
    router.push('/(tabs)/Booking');
  };

  const handleViewBookingsPress = () => {
    router.push('/(tabs)/Booking');
  };

  const handleMenuPress = () => {
    router.push('/(tabs)/Menu');
  };

  const handleNotificationPress = () => {
    router.push('/noti/Notifications');
  };

  useEffect(() => {
    (async () => {
      try {
        // Lọc món đặc sắc theo field isSpecial = true
        const q = query(menuCol, where("isSpecial", "==", true));
        const snap = await getDocs(q);
        const foods = snap.docs.map(doc => ({
          id: doc.id,
          namefood: doc.data().namefood,
          imageUrl: doc.data().imageUrl,
        }));
        setSpecialFoods(foods);
      } catch (err) {
        console.error("❌ Fetch special foods error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Xin chào, {userName}!</Text>
          <Feather name="bell" size={24} color="#0B3B5D" onPress={handleNotificationPress}/>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Le Monde Steak</Text>
          <Text style={styles.bannerSubtitle}>Tận hưởng hương vị Pháp </Text>
        </View>

        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.card} onPress={handleBookingPress}>
            <Feather name="calendar" size={32} color="#0B3B5D" />
            <Text style={styles.cardTitle}>Đặt bàn</Text>
            <Text style={styles.cardDescription}>Đặt bàn cho bữa ăn sắp tới</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleMenuPress}>
            <Feather name="list" size={32} color="#0B3B5D" />
            <Text style={styles.cardTitle}>Thực đơn</Text>
            <Text style={styles.cardDescription}>Khám phá món ăn</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={[styles.sectionTitle, { marginLeft: 16 }]} >Món ăn đặc biệt</Text>
          {loading ? (
        <ActivityIndicator size="large" color="#0B3B5D" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={specialFoods}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingLeft: 16, paddingBottom: 20 }}
          renderItem={({ item }: { item: Food }) => (
            <View style={styles.foodItem}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
              ) : (
                <View style={[styles.foodImage, { backgroundColor: "#eee" }]} />
              )}
              <Text style={styles.foodName}>{item.namefood}</Text>
            </View>
          )}
        />
      )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Giờ mở cửa</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>T2 - T6:</Text>
            <Text style={styles.infoValue}>10:00 - 22:00</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>T7 - CN:</Text>
            <Text style={styles.infoValue}>09:00 - 23:00</Text>
          </View>
          
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Liên hệ</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Điện thoại:</Text>
            <Text style={styles.infoValue}>0123 456 789</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Địa chỉ:</Text>
            <Text style={styles.infoValue}>123 Đường ABC, Quận 1, TP.HCM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  banner: {
    backgroundColor: '#0B3B5D',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 5,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  actionCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodRow: {
    flexDirection: 'row',
  },
  foodItem: {
    width: (width - 48) / 2,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  foodPrice: {
    fontSize: 15,
    color: '#0B3B5D',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    marginTop: 0,
    
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  infoLabel: {
    width: 100,
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});



