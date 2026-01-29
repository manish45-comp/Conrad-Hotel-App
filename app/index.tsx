import { useAuthStore } from "@/src/stores/useAuthStore";
import { Redirect } from "expo-router";
import React from "react";

const Index = () => {
  const { user } = useAuthStore();
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Redirect href="/(auth)/StartOptions" />;
};

export default Index;
