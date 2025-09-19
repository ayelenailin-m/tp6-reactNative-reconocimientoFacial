import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminProductsScreen from "../screens/AdminProductsScreen";

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminProductos"
        component={AdminProductsScreen}
        options={{ title: "Administración" }}
      />
    </Stack.Navigator>
  );
}
