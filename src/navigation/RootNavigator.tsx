import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterFaceScreen from "../screens/RegisterFaceScreen";
import RecognizeFaceScreen from "../screens/RecognizeFaceScreen";
import WalletScreen from "../screens/WalletScreen";
import { colors } from "../theme/colors";

export type RootStackParamList = {
  Login: undefined;
  RegisterFace: undefined;
  RecognizeFace: { cuil?: string } | undefined; //  recibe CUIL nosé
  Wallet: { photoUri?: string } | undefined; // recibe la foto o no
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, text: colors.text },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Ingreso" }}
        />
        <Stack.Screen
          name="RegisterFace"
          component={RegisterFaceScreen}
          options={{ title: "Registro facial" }}
        />
        <Stack.Screen
          name="RecognizeFace"
          component={RecognizeFaceScreen}
          options={{ title: "Ingreso por rostro" }}
        />
        <Stack.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ title: "Panel" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
