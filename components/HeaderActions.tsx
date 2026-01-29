import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

interface HeaderFunc {
  showModal: () => void;
}

const HeaderActions: React.FC<HeaderFunc> = ({ showModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  return pathname === "/dashboard/visitor-list" ? (
    <Appbar.Action
      icon="plus"
      onPress={() => router.push("/dashboard/visitor-form")}
      color={theme.colors.onPrimary}
      size={24}
      style={{
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
        marginRight: 8,
      }}
    />
  ) : (
    <Appbar.Action
      icon="close"
      onPress={showModal}
      color={theme.colors.onError}
      size={24}
      style={{
        backgroundColor: theme.colors.error,
        borderRadius: 20,
        marginRight: 8,
      }}
    />
  );
};

export default HeaderActions;
