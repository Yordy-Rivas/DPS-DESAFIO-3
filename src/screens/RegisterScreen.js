import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { createUserWithEmailAndPassword }
from "firebase/auth";

import { auth }
from "../services/firebaseConfig";

import { LinearGradient }
from "expo-linear-gradient";

export default function RegisterScreen({
  navigation
}) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {

    if (!email || !password) {

      Alert.alert(
        "Error",
        "Complete todos los campos"
      );

      return;

    }

    try {

      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert(
        "Éxito",
        "Cuenta creada"
      );

      navigation.goBack();

    } catch (error) {

      Alert.alert(
        "Error",
        error.message
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >

        <LinearGradient
          colors={[
            "#0F172A",
            "#1E3A8A"
          ]}
          style={styles.container}
        >

          <View style={styles.card}>

            <Text style={styles.title}>
              Crear Cuenta
            </Text>

            <TextInput
              placeholder="Correo"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >

              {
                loading ? (

                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                ) : (

                  <Text style={styles.buttonText}>
                    Registrarse
                  </Text>

                )
              }

            </TouchableOpacity>

          </View>

        </LinearGradient>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#0F172A",
    textAlign: "center",
  },

  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    color: "#0F172A",
  },

  button: {
    backgroundColor: "#10B981",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },

});