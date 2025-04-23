import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRCard = () => {
  return (
    <View style={styles.cardBack}>
      <QRCode value="https://mi.ipos.vn/?token=67c1ae1c574efa0001433c02&zarsrc=33&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&gidzl=cY3oLg-pxLQOFV5NgAthLPe_yL2mg-vHW3pxNkAfuWdKFlWCulYp2u9i-5oqhxHRW3lw3pO4e2qshBZcK0" size={130} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardBack: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

export default QRCard;
