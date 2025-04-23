import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ImageSourcePropType, View } from 'react-native';

interface MenuItemProps {
  /** Source for the image: require(), { uri }, or local number */
  image?: ImageSourcePropType;
  name: string;
  price: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ image, name, price, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.price}>{price}</Text>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff5733',
  },
});
export default MenuItem;