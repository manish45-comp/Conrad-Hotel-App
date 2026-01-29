import { router } from "expo-router";
import React from "react";
import { Appbar } from "react-native-paper";

interface Props {
  title: string;
  onMenu: () => void;
}

export default function AppHeader({ title, onMenu }: Props) {
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Appbar.Action icon="menu" onPress={onMenu} />
      <Appbar.Action
        icon="arrow-left"
        onPress={() => router.back()}
        isLeading={true}
      />
    </Appbar.Header>
  );
}
