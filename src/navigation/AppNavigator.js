import { useEffect, useState } from "react";

import {
  NavigationContainer
} from "@react-navigation/native";

import {
  createNativeStackNavigator
} from "@react-navigation/native-stack";

import {
  onAuthStateChanged
} from "firebase/auth";

import { auth }
from "../services/firebaseConfig";

// AUTH

import LoginScreen
from "../screens/LoginScreen";

import RegisterScreen
from "../screens/RegisterScreen";

// APP

import HomeScreen
from "../screens/HomeScreen";

import AddIncomeScreen
from "../screens/AddIncomeScreen";

import AddExpenseScreen
from "../screens/AddExpenseScreen";

import AddAccountScreen
from "../screens/AddAccountScreen";

import BudgetScreen
from "../screens/BudgetScreen";

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ESCUCHAR LOGIN

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

          setLoading(false);

        }
      );

    return unsubscribe;

  }, []);

  // LOADING

  if (loading) {

    return null;

  }

  return (

    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >

        {
          user ? (

            <>
            
              {/* HOME */}

              <Stack.Screen
                name="Home"
                component={HomeScreen}
              />

              {/* INGRESOS */}

              <Stack.Screen
                name="AddIncome"
                component={AddIncomeScreen}
              />

              {/* GASTOS */}

              <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
              />

              {/* CUENTAS */}

              <Stack.Screen
                name="AddAccount"
                component={AddAccountScreen}
              />

              {/* PRESUPUESTOS */}

              <Stack.Screen
                name="Budget"
                component={BudgetScreen}
              />

            </>

          ) : (

            <>
            
              {/* LOGIN */}

              <Stack.Screen
                name="Login"
                component={LoginScreen}
              />

              {/* REGISTER */}

              <Stack.Screen
                name="Register"
                component={RegisterScreen}
              />

            </>

          )
        }

      </Stack.Navigator>

    </NavigationContainer>

  );

}