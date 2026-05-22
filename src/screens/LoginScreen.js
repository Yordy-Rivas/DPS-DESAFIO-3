import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        "Correo o contraseña incorrectos"
      );
    }
  };

  return (

    <LinearGradient
      colors={["#0F172A", "#1E3A8A", "#10B981"]}
      style={styles.container}
    >

      <StatusBar
        barStyle="light-content"
      />

      <View style={styles.card}>

        <View style={styles.header}>

          <Ionicons
            name="wallet"
            size={60}
            color="#10B981"
          />

          <Text style={styles.title}>
            FinanzApp
          </Text>

          <Text style={styles.subtitle}>
            Controla tus finanzas fácilmente
          </Text>

        </View>

        <View style={styles.inputContainer}>

          <Ionicons
            name="mail"
            size={22}
            color="#64748B"
          />

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

        </View>

        <View style={styles.inputContainer}>

          <Ionicons
            name="lock-closed"
            size={22}
            color="#64748B"
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword(!showPassword)
            }
          >

            <Ionicons
              name={
                showPassword
                  ? "eye"
                  : "eye-off"
              }
              size={22}
              color="#64748B"
            />

          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >

          <Text style={styles.loginButtonText}>
            Iniciar Sesión
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Register")
          }
        >

          <Text style={styles.registerText}>
            ¿No tienes cuenta? Registrarse
          </Text>

        </TouchableOpacity>

      </View>

    </LinearGradient>
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
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 60,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: "#0F172A",
    fontSize: 16,
  },

  loginButton: {
    backgroundColor: "#10B981",
    borderRadius: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  registerText: {
    textAlign: "center",
    marginTop: 25,
    color: "#1E3A8A",
    fontWeight: "600",
    fontSize: 15,
  },

});