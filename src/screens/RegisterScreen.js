import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  Alert
} from "react-native";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function RegisterScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    if (!email || !password) {

      Alert.alert(
        "Error",
        "Complete todos los campos"
      );

      return;
    }

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert(
        "Éxito",
        "Usuario creado"
      );

      navigation.navigate("Login");

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
        Registro
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
        title="Registrarse"
        onPress={handleRegister}
      />

    </View>
  );
}