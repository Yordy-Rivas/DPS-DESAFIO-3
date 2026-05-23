import { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
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

    if (
      !name.trim() ||
      !balance.trim()
    ) {

      Alert.alert(
        "Error",
        "Complete todos los campos"
      );

      return;

    }

    if (
      isNaN(balance)
    ) {

      Alert.alert(
        "Error",
        "Ingrese un saldo válido"
      );

      return;

    }

    try {

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

      navigation.goBack();

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "No se pudo guardar"
      );

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        {
          account
            ? "Editar Cuenta"
            : "Nueva Cuenta"
        }
      </Text>

      <TextInput
        placeholder="Nombre de la cuenta"
        placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Saldo"
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveAccount}
      >

        <Text style={styles.buttonText}>
          {
            account
              ? "Actualizar"
              : "Guardar"
          }
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    color: "#0F172A",
  },

  button: {
    backgroundColor: "#10B981",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

});