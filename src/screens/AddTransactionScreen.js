import { useState, useEffect } from "react";

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
    
        try {
    
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
    
          const lettersRegex =
            /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    
          if (!lettersRegex.test(title)) {
    
            Alert.alert(
              "Error",
              "El título solo debe contener letras"
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
    
          // CREAR
    
          } else {
    
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
    
            const accountsRef = collection(db, "accounts");
    
    const q = query(
      accountsRef,
      where("uid", "==", user.uid),
      where("name", "==", account)
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (accountDoc) => {
    
      const currentBalance =
        accountDoc.data().balance;
    
      const newBalance =
        type === "Ingreso"
          ? currentBalance + Number(amount)
          : currentBalance - Number(amount);
    
      await updateDoc(
        doc(db, "accounts", accountDoc.id),
        {
          balance: newBalance
        }
      );
    
    });
    
            Alert.alert(
              "Éxito",
              "Transacción guardada correctamente"
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
    
            {/* TÍTULO */}
    
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
    
            {/* MONTO */}
    
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
    
            {/* CATEGORÍA */}
    
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
    
            {/* CUENTA */}
    
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
    
              <Text style={styles.saveButtonText}>
                {
                  transaction
                    ? "Actualizar"
                    : "Guardar Transacción"
                }
              </Text>
    
            </TouchableOpacity>
    
          </ScrollView>
    
        </LinearGradient>
      );
    }