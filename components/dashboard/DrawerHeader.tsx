import React from "react";
import { Image, View } from "react-native";
import logo from "../../assets/images/icon-removebg.png";

export default function DrawerHeader() {
  return (
    <View
      style={{ paddingTop: 16, paddingHorizontal: 16, alignItems: "center" }}
    >
      {/* <Text style={{ fontSize: 28, fontWeight: "700" }}>VMS</Text> */}
      <Image
        source={logo}
        height={200}
        width={200}
        style={{ height: 50, width: 130, objectFit: "contain" }}
      />
      {/* <Text variant="titleLarge" style={{ fontFamily: "Inter_700Bold" }}>
        {DASHBOARD_TITLE}
      </Text> */}
    </View>
  );
}
