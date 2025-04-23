import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

import { StyleProp, ViewStyle, TextStyle } from "react-native";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  isLoading: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, containerStyles, isLoading && styles.disabled]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>{title}</Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF5733", // Màu tùy chỉnh
    borderRadius: 12,
    minHeight: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  text: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginLeft: 10,
  },
});

export default CustomButton;