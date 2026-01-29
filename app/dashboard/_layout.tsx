import { Slot, usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, View } from "react-native";
import {
  DrawerLayout,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import AppHeader from "@/components/dashboard/AppHeader";
import DrawerContent from "@/components/dashboard/DrawerContent";
import { ROUTES, ROUTE_TITLES, RouteKey } from "@/constants/dashboardRoutes";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const drawerRef = useRef<DrawerLayout>(null);
  const { logout } = useAuthStore();
  const [active, setActive] = useState<RouteKey>(RouteKey.VisitorList);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (isDrawerOpen) {
        drawerRef.current?.closeDrawer();
        return true; // "true" prevents the default back action (closing the app)
      }
      return false; // "false" lets the system handle the back button normally
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => backHandler.remove();
  }, [isDrawerOpen]);

  // ---------------------------------------------
  // Sync active tab based on current pathname
  // ---------------------------------------------
  useEffect(() => {
    const current = pathname.split("/").pop(); // last segment

    const found = Object.entries(ROUTES).find(
      ([, path]) => path.split("/").pop() === current,
    );

    if (found) setActive(found[0] as RouteKey);
  }, [pathname]);

  // ---------------------------------------------
  // Safe Navigation Handler (No race conditions)
  // ---------------------------------------------
  const handleNavigate = useCallback(
    async (key: RouteKey, path: string) => {
      if (pathname === path) return;
      // Close drawer safely before navigating
      await drawerRef.current?.closeDrawer();
      router.replace(path);
      setActive(key);
    },
    [pathname],
  );

  // ---------------------------------------------
  // Logout Handler
  // ---------------------------------------------
  const handleLogout = useCallback(async () => {
    await logout();
    router.replace("/(auth)/login");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={260}
        drawerPosition="right"
        onDrawerOpen={() => setIsDrawerOpen(true)}
        onDrawerClose={() => setIsDrawerOpen(false)}
        renderNavigationView={() => (
          <DrawerContent
            active={active}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
      >
        <View style={{ flex: 1 }}>
          {/* ---------------- HEADER ---------------- */}
          <AppHeader
            title={ROUTE_TITLES[active]}
            onMenu={() => drawerRef.current?.openDrawer()}
          />

          {/* ---------------- CONTENT ---------------- */}
          <View style={{ flex: 1 }}>
            <Slot screenOptions={{ animation: "fade" }} />
          </View>
        </View>
      </DrawerLayout>
    </GestureHandlerRootView>
  );
}
