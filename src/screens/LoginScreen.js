import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  Alert
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email || !password) {

      Alert.alert(
        "Error",
        "Complete todos los campos"
      );

      return;
    }

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigation.navigate("Home");

    } catch (error) {

      Alert.alert(
        "Error",
        error.message
      );
    }
  };

  return (

    <View style={{
      padding: 20,
      marginTop: 50
    }}>

      <Text style={{
        fontSize: 30
      }}>
        Login
      </Text>

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          marginTop: 20,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          marginTop: 20,
          padding: 10
        }}
      />

      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
      />

      <Button
        title="Ir a Registro"
        onPress={() =>
          navigation.navigate("Register")
        }
      />

    </View>
  );
}