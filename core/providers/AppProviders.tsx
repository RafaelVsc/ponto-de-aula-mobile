import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

import "@/core/validation/setup";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../auth/AuthProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toast />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
