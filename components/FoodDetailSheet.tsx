
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/cartcontext';
import * as Haptics from 'expo-haptics';
import { AddToCartAnimation } from './AddToCartAnimation';

const { width } = Dimensions.get('window');

interface FoodItem {
  $id: string;
  namefood: string;
  price: number;
  imageUrl: string;
}

export default function FoodDetailSheet({ item }: { item: FoodItem }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStartPos, setAnimationStartPos] = useState({ x: 0, y: 0 });

  const handleDecrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = (event: any) => {

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setShowAnimation(false);
      addToCart({
        foodDocId: item.$id,
        name: item.namefood,
        price: item.price,
        quantity: quantity,
        imageUrl: item.imageUrl
      });
    }, 750);
  };

  return (
    <View style={styles.container}>
      {showAnimation && (
        <AddToCartAnimation
          startPosition={animationStartPos}
          onComplete={() => setShowAnimation(false)}
        />
      )}
      
      <Image 
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{item.namefood}</Text>
        <Text style={styles.price}>
          {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={handleDecrease}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity 
            onPress={handleIncrease}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
          <Text style={styles.totalPrice}>
            {(item.price * quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden'
  },
  image: {
    width: width,
    height: width * 0.8,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#0B3B5D',
    fontWeight: '600',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#0B3B5D',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  totalPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
