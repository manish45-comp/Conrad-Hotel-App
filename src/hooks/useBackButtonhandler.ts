import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { BackHandler } from "react-native";
import { useVisitorFormStore } from "../stores/useVisitorFormStore";

type UseBackButtonHandlerOptions = {
  enabled?: boolean;
};

export function useBackButtonhandler(
  options: UseBackButtonHandlerOptions = {},
) {
  const { enabled = true } = options;

  const { reset } = useVisitorFormStore();

  const [showConfirm, setShowConfirm] = useState(false);

  const onConfirmExit = useCallback(() => {
    reset();
    setShowConfirm(false);
    router.dismissAll();
    router.replace("/(auth)/StartOptions");
  }, [reset]);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      const onBackPress = () => {
        setShowConfirm(true);
        return true; // block default back action
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [enabled]),
  );

  return {
    showConfirm,
    setShowConfirm,
    onConfirmExit,
  };
}
