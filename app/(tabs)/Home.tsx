import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '@/context/GloballProvider';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { menuCol, db, auth } from '@/lib/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { Modalize } from 'react-native-modalize';
import FoodDetailSheet from '@/components/FoodDetailSheet';
import { FoodDoc } from '@/context/types';

const { width } = Dimensions.get('window');

interface Food {
  id: string;
  $id: string;
  namefood: string;
  imageUrl: string;
  price: number;
}

export default function HomeScreen() {
  const modalizeRef = useRef<Modalize>(null);
  const router = useRouter();
  const { profile } = useGlobalContext();
  const [specialFoods, setSpecialFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Food | null>(null);
  const userName = profile?.username || 'Khách';

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, "noti"),
        where("userId", "==", auth.currentUser.uid),
        where("read", "==", false)
      );
      const snap = await getDocs(q);
      setUnreadCount(snap.size);
    };

    fetchUnreadCount();

    // Định kỳ cập nhật số lượng thông báo mỗi 1 giây
    const intervalId = setInterval(fetchUnreadCount, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBookingPress = () => router.push('/(tabs)/Booking');
  const handleMenuPress = () => router.push('/(tabs)/Menu');
  const handleNotificationPress = () => router.push('/noti/Notifications');

   const openDetail = (item: Food) => {
      setSelectedItem(item);
      modalizeRef.current?.open();
    };

  useEffect(() => {
    (async () => {
      try {
        const q = query(menuCol, where("isSpecial", "==", true));
        const snap = await getDocs(q);
        const foods = snap.docs.map(doc => ({
          id: doc.id,
          $id: doc.id, // Using doc.id as $id
          namefood: doc.data().namefood,
          imageUrl: doc.data().imageUrl || '', // Provide default empty string
          price: doc.data().price || 0, // Adding price with a default value
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
        <LinearGradient
          colors={['#0B3B5D', '#1E5B8D']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Xin chào,</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
              <View>
                <Feather name="bell" size={24} color="#fff" />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Le Monde Steak</Text>
            <Text style={styles.bannerSubtitle}>Tận hưởng hương vị Pháp</Text>
          </View>

          <View style={styles.actionCards}>
            <TouchableOpacity onPress={handleBookingPress} style={styles.card}>
              <View style={styles.cardIcon}>
                <Feather name="calendar" size={28} color="#0B3B5D" />
              </View>
              <Text style={styles.cardTitle}>Đặt bàn</Text>
              <Text style={styles.cardDescription}>Đặt bàn cho bữa ăn sắp tới</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMenuPress} style={styles.card}>
              <View style={styles.cardIcon}>
                <Feather name="list" size={28} color="#0B3B5D" />
              </View>
              <Text style={styles.cardTitle}>Thực đơn</Text>
              <Text style={styles.cardDescription}>Khám phá món ăn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.specialSection}>
            <Text style={styles.sectionTitle}>Món ăn đặc biệt</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0B3B5D" style={styles.loader} />
            ) : (
              <FlatList
                data={specialFoods}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.foodList}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.foodItem} onPress={() => openDetail(item as Food)}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
                    ) : (
                      <View style={[styles.foodImage, styles.placeholderImage]} />
                    )}
                    <Text style={styles.foodName}>{item.namefood}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Feather name="clock" size={20} color="#0B3B5D" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Giờ mở cửa:</Text>
                  <Text style={styles.infoValue}>T2 - T6: 10:00 - 22:00</Text>
                  <Text style={styles.infoValue}>T7 - CN: 09:00 - 23:00</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Feather name="phone" size={20} color="#0B3B5D" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Điện thoại:</Text>
                  <Text style={styles.infoValue}>038 655 0869</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={20} color="#0B3B5D" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Địa chỉ:</Text>
                  <Text style={styles.infoValue}>231 Tô Hiệu, P. Dịch Vọng, Quận Cầu Giấy, Hà Nội</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Modalize ref={modalizeRef} adjustToContentHeight>
                {selectedItem && <FoodDetailSheet item={selectedItem} />}
        </Modalize>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  banner: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B3B5D',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  actionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B3B5D',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  specialSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B3B5D',
    marginBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  foodList: {
    paddingVertical: 10,
  },
  foodItem: {
    width: (width - 60) / 2,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderImage: {
    backgroundColor: '#E8F0F5',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B3B5D',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#0B3B5D',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
});