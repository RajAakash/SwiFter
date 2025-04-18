import React from "react";
import { AppNavigation } from "./navigation";
import { AuthContextProvider } from "./context/auth-context/auth-context.js";

export default function App() {
  return (
    <AuthContextProvider>
      <AppNavigation />
    </AuthContextProvider>
  );
}
