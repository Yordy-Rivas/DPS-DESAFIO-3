import { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { auth, db }
from "../services/firebaseConfig";

import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { LinearGradient }
from "expo-linear-gradient";

import { Ionicons }
from "@expo/vector-icons";

import { Picker }
from "@react-native-picker/picker";

export default function AddTransactionScreen({
  route,
  navigation
}) {

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [type, setType] =
    useState("Gasto");

  const [category, setCategory] =
    useState("Comida");

  const [account, setAccount] =
    useState("Efectivo");

  const [loading, setLoading] =
    useState(false);

  const transaction =
    route?.params?.transaction;

  // CARGAR DATOS

  useEffect(() => {

    if (transaction) {

      setTitle(transaction.title);

      setAmount(
        transaction.amount.toString()
      );

      setDescription(
        transaction.description
      );

      setType(transaction.type);

      setCategory(
        transaction.category
      );

      setAccount(
        transaction.account
      );

    }

  }, [transaction]);

  // GUARDAR

  const saveTransaction = async () => {

    if (!title.trim()) {

      Alert.alert(
        "Error",
        "Ingrese un título"
      );

      return;

    }

    const lettersRegex =
      /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!lettersRegex.test(title)) {

      Alert.alert(
        "Error",
        "El título solo debe contener letras"
      );

      return;

    }

    if (!amount.trim()) {

      Alert.alert(
        "Error",
        "Ingrese un monto"
      );

      return;

    }

    if (
      isNaN(amount) ||
      Number(amount) <= 0
    ) {

      Alert.alert(
        "Error",
        "Ingrese un monto válido"
      );

      return;

    }

    if (!description.trim()) {

      Alert.alert(
        "Error",
        "Ingrese una descripción"
      );

      return;

    }

    try {

      setLoading(true);

      const user =
        auth.currentUser;

      if (!user) {

        Alert.alert(
          "Error",
          "Usuario no autenticado"
        );

        return;

      }

      // EDITAR

      if (transaction) {

        await updateDoc(
          doc(
            db,
            "transactions",
            transaction.id
          ),
          {
            title,
            amount: Number(amount),
            type,
            category,
            account,
            description,
          }
        );

        Alert.alert(
          "Éxito",
          "Transacción actualizada"
        );

      } else {

        // CREAR

        await addDoc(
          collection(db, "transactions"),
          {
            uid: user.uid,

            title,

            amount: Number(amount),

            type,

            category,

            account,

            description,

            date:
              new Date().toLocaleDateString(),

            createdAt:
              serverTimestamp(),
          }
        );

        // ACTUALIZAR BALANCE

        const accountsRef =
          collection(db, "accounts");

        const q = query(
          accountsRef,
          where("uid", "==", user.uid),
          where("name", "==", account)
        );

        const querySnapshot =
          await getDocs(q);

        querySnapshot.forEach(async (accountDoc) => {

          const currentBalance =
            accountDoc.data().balance;

          const newBalance =
            type === "Ingreso"
              ? currentBalance + Number(amount)
              : currentBalance - Number(amount);

          await updateDoc(
            doc(
              db,
              "accounts",
              accountDoc.id
            ),
            {
              balance: newBalance
            }
          );

        });

        Alert.alert(
          "Éxito",
          "Transacción guardada"
        );

      }

      // LIMPIAR

      setTitle("");

      setAmount("");

      setDescription("");

      setType("Gasto");

      setCategory("Comida");

      setAccount("Efectivo");

      navigation.goBack();

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Ocurrió un problema"
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

          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            <View style={styles.header}>

              <Ionicons
                name="wallet"
                size={60}
                color="#10B981"
              />

              <Text style={styles.title}>
                {
                  transaction
                    ? "Editar Transacción"
                    : "Nueva Transacción"
                }
              </Text>

            </View>

            <Text style={styles.label}>
              Tipo de Transacción
            </Text>

            <View style={styles.typeContainer}>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "Ingreso" &&
                  styles.activeIncome
                ]}
                onPress={() =>
                  setType("Ingreso")
                }
              >

                <Text style={styles.typeText}>
                  Ingreso
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "Gasto" &&
                  styles.activeExpense
                ]}
                onPress={() =>
                  setType("Gasto")
                }
              >

                <Text style={styles.typeText}>
                  Gasto
                </Text>

              </TouchableOpacity>

            </View>

            <Text style={styles.label}>
              Título
            </Text>

            <View style={styles.inputContainer}>

              <TextInput
                placeholder="Ej. Compra comida"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

            </View>

            <Text style={styles.label}>
              Monto
            </Text>

            <View style={styles.inputContainer}>

              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {

                  const cleaned =
                    text.replace(/[^0-9.]/g, "");

                  setAmount(cleaned);

                }}
                style={styles.input}
              />

            </View>

            <Text style={styles.label}>
              Categoría
            </Text>

            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={category}
                onValueChange={(itemValue) =>
                  setCategory(itemValue)
                }
                style={styles.picker}
              >

                <Picker.Item
                  label="Comida"
                  value="Comida"
                />

                <Picker.Item
                  label="Transporte"
                  value="Transporte"
                />

                <Picker.Item
                  label="Entretenimiento"
                  value="Entretenimiento"
                />

                <Picker.Item
                  label="Salario"
                  value="Salario"
                />

                <Picker.Item
                  label="Salud"
                  value="Salud"
                />

              </Picker>

            </View>

            <Text style={styles.label}>
              Cuenta
            </Text>

            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={account}
                onValueChange={(itemValue) =>
                  setAccount(itemValue)
                }
                style={styles.picker}
              >

                <Picker.Item
                  label="Efectivo"
                  value="Efectivo"
                />

                <Picker.Item
                  label="Cuenta Bancaria"
                  value="Cuenta Bancaria"
                />

                <Picker.Item
                  label="Tarjeta"
                  value="Tarjeta"
                />

              </Picker>

            </View>

            <Text style={styles.label}>
              Descripción
            </Text>

            <View style={styles.descriptionContainer}>

              <TextInput
                placeholder="Agrega detalles..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                style={styles.descriptionInput}
              />

            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveTransaction}
              disabled={loading}
            >

              {
                loading ? (

                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                ) : (

                  <Text style={styles.saveButtonText}>
                    {
                      transaction
                        ? "Actualizar"
                        : "Guardar Transacción"
                    }
                  </Text>

                )
              }

            </TouchableOpacity>

          </ScrollView>

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
    marginBottom: 30,
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

  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  typeButton: {
    width: "48%",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#334155",
  },

  activeIncome: {
    backgroundColor: "#10B981",
  },

  activeExpense: {
    backgroundColor: "#EF4444",
  },

  typeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 60,
    justifyContent: "center",
  },

  input: {
    color: "#0F172A",
    fontSize: 16,
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 20,
  },

  picker: {
    color: "#0F172A",
  },

  descriptionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },

  descriptionInput: {
    color: "#0F172A",
    fontSize: 16,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#10B981",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

});