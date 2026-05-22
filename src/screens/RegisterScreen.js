import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

import { Picker } from "@react-native-picker/picker";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function RegisterScreen({ navigation }) {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      Alert.alert(
        "Error",
        "Complete todos los campos"
      );

      return;
    }

    if (password.length < 6) {

      Alert.alert(
        "Error",
        "La contraseña debe tener mínimo 6 caracteres"
      );

      return;
    }

    if (password !== confirmPassword) {

      Alert.alert(
        "Error",
        "Las contraseñas no coinciden"
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
        "Usuario creado correctamente"
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

    <LinearGradient
      colors={["#0F172A", "#1E3A8A", "#10B981"]}
      style={styles.container}
    >

      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center"
        }}
      >

        <View style={styles.card}>

          <View style={styles.header}>

            <Ionicons
              name="wallet"
              size={60}
              color="#10B981"
            />

            <Text style={styles.title}>
              Crear Cuenta
            </Text>

            <Text style={styles.subtitle}>
              Administra tus finanzas inteligentemente
            </Text>

          </View>

          {/* Nombre */}

          <View style={styles.inputContainer}>

            <Ionicons
              name="person"
              size={22}
              color="#64748B"
            />

            <TextInput
              placeholder="Nombre completo"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />

          </View>

          {/* Correo */}

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

          {/* Contraseña */}

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

          {/* Confirmar contraseña */}

          <View style={styles.inputContainer}>

            <Ionicons
              name="shield-checkmark"
              size={22}
              color="#64748B"
            />

            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >

              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye"
                    : "eye-off"
                }
                size={22}
                color="#64748B"
              />

            </TouchableOpacity>

          </View>

          {/* Moneda */}

          <View style={styles.pickerContainer}>

            <Ionicons
              name="cash"
              size={22}
              color="#64748B"
            />

            <Picker
              selectedValue={currency}
              onValueChange={(itemValue) =>
                setCurrency(itemValue)
              }
              style={styles.picker}
            >

              <Picker.Item
                label="USD - Dólar"
                value="USD"
              />

              <Picker.Item
                label="EUR - Euro"
                value="EUR"
              />

              <Picker.Item
                label="MXN - Peso Mexicano"
                value="MXN"
              />

              <Picker.Item
                label="SVC - Colón Salvadoreño"
                value="SVC"
              />

              <Picker.Item
                label="BTC - Bitcoin"
                value="BTC"
              />

            </Picker>

          </View>

          {/* Botón */}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >

            <Text style={styles.registerButtonText}>
              Registrarse
            </Text>

          </TouchableOpacity>

          {/* Login */}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Login")
            }
          >

            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? Iniciar sesión
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 5,
    textAlign: "center",
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

  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 60,
  },

  picker: {
    flex: 1,
    color: "#0F172A",
  },

  registerButton: {
    backgroundColor: "#10B981",
    borderRadius: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  loginText: {
    textAlign: "center",
    marginTop: 25,
    color: "#1E3A8A",
    fontWeight: "600",
    fontSize: 15,
  },

});