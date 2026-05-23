import { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar
} from "react-native";

import {
  collection,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import {
  auth,
  db
} from "../services/firebaseConfig";

import { LinearGradient }
from "expo-linear-gradient";

import { Ionicons }
from "@expo/vector-icons";

export default function AddAccountScreen({
  route,
  navigation
}) {

  const account =
    route?.params?.account;

  const [name, setName] =
    useState("");

  const [balance, setBalance] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // CARGAR DATOS SI EDITA

  useEffect(() => {

    if (account) {

      setName(account.name);

      setBalance(
        account.balance.toString()
      );

    }

  }, [account]);

  // GUARDAR

  const saveAccount = async () => {

    if (!name.trim()) {

      Alert.alert(
        "Error",
        "Ingrese el nombre de la cuenta"
      );

      return;

    }

    const lettersRegex =
      /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!lettersRegex.test(name)) {

      Alert.alert(
        "Error",
        "El nombre solo debe contener letras"
      );

      return;

    }

    if (!balance.trim()) {

      Alert.alert(
        "Error",
        "Ingrese un saldo"
      );

      return;

    }

    if (
      isNaN(balance) ||
      Number(balance) < 0
    ) {

      Alert.alert(
        "Error",
        "Ingrese un saldo válido"
      );

      return;

    }

    try {

      setLoading(true);

      // EDITAR

      if (account) {

        await updateDoc(
          doc(
            db,
            "accounts",
            account.id
          ),
          {
            name,
            balance: Number(balance),
          }
        );

        Alert.alert(
          "Éxito",
          "Cuenta actualizada"
        );

      } else {

        // CREAR

        await addDoc(
          collection(db, "accounts"),
          {
            uid: auth.currentUser.uid,
            name,
            balance: Number(balance),
          }
        );

        Alert.alert(
          "Éxito",
          "Cuenta creada"
        );

      }

      // LIMPIAR

      setName("");

      setBalance("");

      navigation.goBack();

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "No se pudo guardar"
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
          colors={["#0F172A", "#1E3A8A"]}
          style={styles.container}
        >

          <StatusBar
            barStyle="light-content"
          />

          <View style={styles.header}>

            <Ionicons
              name="wallet"
              size={60}
              color="#10B981"
            />

            <Text style={styles.title}>
              {
                account
                  ? "Editar Cuenta"
                  : "Nueva Cuenta"
              }
            </Text>

          </View>

          {/* NOMBRE */}

          <Text style={styles.label}>
            Nombre de la Cuenta
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="card"
              size={22}
              color="#64748B"
            />

            <TextInput
              placeholder="Ej. Efectivo"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

          </View>

          {/* SALDO */}

          <Text style={styles.label}>
            Saldo Inicial
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="cash"
              size={22}
              color="#64748B"
            />

            <TextInput
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={balance}
              onChangeText={(text) => {

                const cleaned =
                  text.replace(/[^0-9.]/g, "");

                setBalance(cleaned);

              }}
              style={styles.input}
            />

          </View>

          {/* BOTÓN */}

          <TouchableOpacity
            style={styles.button}
            onPress={saveAccount}
            disabled={loading}
          >

            {
              loading ? (

                <ActivityIndicator
                  color="#FFFFFF"
                />

              ) : (

                <Text style={styles.buttonText}>
                  {
                    account
                      ? "Actualizar"
                      : "Guardar"
                  }
                </Text>

              )
            }

          </TouchableOpacity>

        </LinearGradient>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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

  button: {
    backgroundColor: "#10B981",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

});