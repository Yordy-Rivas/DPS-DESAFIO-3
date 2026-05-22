import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar
} from "react-native";

import { auth, db }
from "../services/firebaseConfig";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { LinearGradient }
from "expo-linear-gradient";

import { Ionicons }
from "@expo/vector-icons";

import { Picker }
from "@react-native-picker/picker";

export default function AddTransactionScreen() {

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

  // GUARDAR TRANSACCIÓN

  const saveTransaction = async () => {

    try {

      // VALIDACIONES

      if (
        !title.trim() ||
        !amount.trim() ||
        !description.trim()
      ) {

        Alert.alert(
          "Error",
          "Complete todos los campos"
        );

        return;
      }

      // VALIDAR TÍTULO

      const lettersRegex =
        /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

      if (!lettersRegex.test(title)) {

        Alert.alert(
          "Error",
          "El título solo debe contener letras"
        );

        return;
      }

      // VALIDAR DESCRIPCIÓN

      if (
        !lettersRegex.test(description)
      ) {

        Alert.alert(
          "Error",
          "La descripción solo debe contener letras"
        );

        return;
      }

      // VALIDAR MONTO

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

      // USUARIO

      const user =
        auth.currentUser;

      if (!user) {

        Alert.alert(
          "Error",
          "Usuario no autenticado"
        );

        return;
      }

      // GUARDAR EN FIREBASE

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
          date: new Date(),
          createdAt: serverTimestamp(),
        }
      );

      Alert.alert(
        "Éxito",
        "Transacción guardada correctamente"
      );

      // LIMPIAR FORMULARIO

      setTitle("");
      setAmount("");
      setDescription("");

      setType("Gasto");
      setCategory("Comida");
      setAccount("Efectivo");

    } catch (error) {

      console.log(
        "ERROR FIREBASE:",
        error
      );

      Alert.alert(
        "Error",
        "Ocurrió un problema al guardar"
      );

    }

  };

  return (

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

        {/* HEADER */}

        <View style={styles.header}>

          <Ionicons
            name="wallet"
            size={60}
            color="#10B981"
          />

          <Text style={styles.title}>
            Nueva Transacción
          </Text>

          <Text style={styles.subtitle}>
            Registra tus ingresos y gastos
          </Text>

        </View>

        {/* TIPO */}

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

            <Ionicons
              name="arrow-down-circle"
              size={22}
              color="#FFFFFF"
            />

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

            <Ionicons
              name="arrow-up-circle"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.typeText}>
              Gasto
            </Text>

          </TouchableOpacity>

        </View>

        {/* TÍTULO */}

        <Text style={styles.label}>
          Título
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="create"
            size={22}
            color="#64748B"
          />

          <TextInput
            placeholder="Ej. Compra comida"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

        </View>

        {/* MONTO */}

        <Text style={styles.label}>
          Monto
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
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />

        </View>

        {/* CATEGORÍA */}

        <Text style={styles.label}>
          Categoría
        </Text>

        <View style={styles.pickerContainer}>

          <Ionicons
            name="grid"
            size={22}
            color="#64748B"
          />

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

        {/* CUENTA */}

        <Text style={styles.label}>
          Cuenta
        </Text>

        <View style={styles.pickerContainer}>

          <Ionicons
            name="card"
            size={22}
            color="#64748B"
          />

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

        {/* DESCRIPCIÓN */}

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

        {/* BOTÓN */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveTransaction}
        >

          <Ionicons
            name="save"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.saveButtonText}>
            Guardar Transacción
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </LinearGradient>
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

  subtitle: {
    color: "#CBD5E1",
    marginTop: 5,
    fontSize: 15,
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
    flexDirection: "row",
    opacity: 0.6,
  },

  activeIncome: {
    backgroundColor: "#10B981",
    opacity: 1,
  },

  activeExpense: {
    backgroundColor: "#EF4444",
    opacity: 1,
  },

  typeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
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

  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 60,
  },

  picker: {
    flex: 1,
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
    flexDirection: "row",
    marginBottom: 30,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

});