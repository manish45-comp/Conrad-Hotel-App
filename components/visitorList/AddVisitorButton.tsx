import { RelativePathString, router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  title: string;
  path: RelativePathString;
}

const AddVisitorButton: React.FC<Props> = ({ visible, title, path }) => {
  if (!visible) return null;

  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: inset.bottom + 12,
        right: 0,
        left: 0,
        paddingHorizontal: 16,
      }}
    >
      <Button
        mode="contained"
        style={{ borderRadius: 28, paddingHorizontal: 16 }}
        onPress={() => router.push(path)}
      >
        {title}
      </Button>
    </View>
  );
};

export default AddVisitorButton;
