import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import WalletScreen from "./src/screens/WalletScreen";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f14" }}>
      <StatusBar barStyle="light-content" />
      {isAuthenticated ? (
        <WalletScreen
          photoUri={photoUri}
          onLogout={() => {
            setIsAuthenticated(false);
            setPhotoUri(null);
          }}
        />
      ) : (
        <LoginScreen
          onSuccess={(uri) => {
            setPhotoUri(uri);
            setIsAuthenticated(true);
          }}
        />
      )}
    </SafeAreaView>
  );
}
