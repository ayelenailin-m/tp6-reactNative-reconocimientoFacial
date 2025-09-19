// import React from "react";
// import RootNavigator from "./src/navigation/RootNavigator";

// export default function App() {
//   return <RootNavigator />;
// }

import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminStack from "./src/navigation/AdminStack";
import { ProductsProvider } from "./src/context/ProductsContext";
// import HomeScreen from './src/screens/HomeScreen'; // ejemplo

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ProductsProvider>
      <NavigationContainer>
        <Tab.Navigator>
          {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
          <Tab.Screen name="Admin" component={AdminStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </ProductsProvider>
  );
}
