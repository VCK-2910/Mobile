import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategory,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1, },
  categoryScroll: { 
    flexDirection: "row", 
    paddingRight: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    
    paddingLeft: 10, // Xóa khoảng trống bên trái
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginRight: 8, // Khoảng cách giữa các mục
  },
  firstCategory: {
    marginLeft: 0, // Đảm bảo mục đầu tiên không bị lệch
  },
  activeCategory: { backgroundColor: "#007bff" },
  categoryText: { fontSize: 16, color: "#000" },
  activeCategoryText: { color: "#fff", fontWeight: "bold" },
});

export default CategorySelector;
