import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Alert, BackHandler } from "react-native";
import { useVisitorFormStore } from "../stores/useVisitorFormStore";

type UseBackButtonHandlerOptions = {
  enabled?: boolean;
};

export function useBackButtonhandler(
  options: UseBackButtonHandlerOptions = {},
) {
  const { enabled = true } = options;

  const { reset } = useVisitorFormStore();

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      const onBackPress = () => {
        Alert.alert("Leave?", "Are you sure you want to go back to Home?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            style: "destructive",
            onPress: () => {
              reset();
              router.dismissAll();
              router.replace("/(auth)/StartOptions");
            },
          },
        ]);

        return true; // block default back action
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [enabled, reset]),
  );
}
