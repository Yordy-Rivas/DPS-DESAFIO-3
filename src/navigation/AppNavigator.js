import React, {
  useEffect,
  useState
} from "react";

import {
  NavigationContainer
} from "@react-navigation/native";

import {
  createNativeStackNavigator
} from "@react-navigation/native-stack";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  ActivityIndicator,
  View
} from "react-native";

import {
  auth
} from "../services/firebaseConfig";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AccountsScreen from "../screens/AccountsScreen";
import AddAccountScreen from "../screens/AddAccountScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";

import BudgetScreen from "../screens/BudgetScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {

        setUser(currentUser);

        setLoading(false);

      }
    );

    return unsubscribe;

  }, []);

  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >

        <ActivityIndicator size="large" />

      </View>

    );

  }

  return (

    <NavigationContainer>

      <Stack.Navigator>

        {user ? (

          <>

            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="Accounts"
              component={AccountsScreen}
            />

            <Stack.Screen
              name="AddAccount"
              component={AddAccountScreen}
            />

            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
            />

            <Stack.Screen
              name="Budget"
              component={BudgetScreen}
            />

          </>

        ) : (

          <>

            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>

  );

}