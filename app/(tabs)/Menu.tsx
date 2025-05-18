import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modalize } from "react-native-modalize";
import { menuCol, storage } from "@/lib/firebase";
import { getDocs } from "firebase/firestore";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import MenuItem from "@/components/menuitem";
import { FoodDoc } from "@/context/types";
import { Feather } from "@expo/vector-icons";
import FoodDetailSheet from "@/components/FoodDetailSheet";
import CategorySelector from "@/components/CategorySelector";


const categories = ["Tất cả", "Starter", "Main", "Pasta", "Drink"];

export default function MenuScreen() {
  const modalizeRef = useRef<Modalize>(null);
  const [menuItems, setMenuItems] = useState<FoodDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedItem, setSelectedItem] = useState<FoodDoc | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  

  async function fetchMenuItems() {
    try {
      const snap = await getDocs(menuCol);
      const items: FoodDoc[] = await Promise.all(
        snap.docs.map(async docSnap => {
          const data = docSnap.data();
          let imageUrl = data.imageUrl as string;
          if (!imageUrl && data.image) {
            try {
              imageUrl = await getDownloadURL(
                storageRef(storage, data.image as string)
              );
            } catch {
              imageUrl = "";
            }
          }
          return {
            id: docSnap.id,
            $id: docSnap.id,
            namefood: data.namefood,
            category: data.category,
            price: data.price ?? 0,
            imageUrl: imageUrl,
          } as FoodDoc;
        })
      );
      setMenuItems(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = menuItems.filter(item => {
    const byCategory = selectedCategory === "Tất cả" || item.category === selectedCategory;
    const bySearch = item.namefood.toLowerCase().includes(searchQuery.toLowerCase());
    return byCategory && bySearch;
  });

  const keyExtractor = (item: FoodDoc) => item.$id;

  const openDetail = (item: FoodDoc) => {
    setSelectedItem(item);
    modalizeRef.current?.open();
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Menu</Text>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0B3B5D" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={({ item }) => (
            <MenuItem
              image={{ uri: item.imageUrl }}
              name={item.namefood}
              price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              onPress={() => openDetail(item)}
            />
          )}
          keyExtractor={keyExtractor}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={2}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Feather name="clipboard" size={60} color="#ccc" />
              <Text style={styles.emptyTitle}>Không tìm thấy món ăn</Text>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'Không tìm thấy món ăn phù hợp với tìm kiếm của bạn.' 
                  : 'Không có món ăn nào trong danh mục này.'}
              </Text>
            </View>
          )}
        />
      )}

      <Modalize ref={modalizeRef} adjustToContentHeight>
        {selectedItem && <FoodDetailSheet item={selectedItem} />}
      </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginVertical: 5, marginLeft: 16 },
  searchContainer:{ flexDirection:'row', alignItems:'center', backgroundColor:'#f0f0f0', margin:16, borderRadius:30, paddingHorizontal:16, marginVertical:8 },
  searchInput:{ flex:1, marginLeft:8, marginVertical:10 },
  list:{ padding:8 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuList: { paddingHorizontal: 16, paddingBottom: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 8 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 4 }
});
