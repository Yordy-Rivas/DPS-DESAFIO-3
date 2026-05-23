import AppNavigator from "./src/navigation/AppNavigator";
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './src/services/firebaseConfig';

import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';

import {
  View,
  ActivityIndicator
} from 'react-native';

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);
      setLoading(false);

    });

    return unsubscribe;

  }, []);

  if (loading) {

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );

  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );

}
export default function App() {
  return <AppNavigator />;
}