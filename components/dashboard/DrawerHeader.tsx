import React from "react";
import { Image, View } from "react-native";
import logo from "../../assets/images/icon-removebg.png";

export default function DrawerHeader() {
  return (
    <View
      style={{ paddingTop: 16, paddingHorizontal: 16, alignItems: "center" }}
    >
      <Image
        source={logo}
        height={200}
        width={200}
        style={{ height: 50, width: 130, objectFit: "contain" }}
      />
    </View>
  );
}
