import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from "react-native";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import { useState, useEffect } from "react";

import { auth, db } from "../services/firebaseConfig";

import { LinearGradient } from "expo-linear-gradient";

export default function BudgetScreen() {

  const [category, setCategory] =
    useState("");

  const [limit, setLimit] =
    useState("");

  const [budgets, setBudgets] =
    useState([]);

  const user = auth.currentUser;

  // CARGAR PRESUPUESTOS

  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "budgets"),
      where("uid", "==", user.uid)
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        let list = [];

        snapshot.forEach((doc) => {

          list.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setBudgets(list);

      });

    return () => unsubscribe();

  }, []);

  // AGREGAR PRESUPUESTO

  const addBudget = async () => {

    if (!category || !limit) {

      Alert.alert(
        "Error",
        "Completa todos los campos"
      );

      return;

    }

    if (isNaN(limit)) {

      Alert.alert(
        "Error",
        "El límite debe ser numérico"
      );

      return;

    }

    try {

      await addDoc(
        collection(db, "budgets"),
        {
          category,
          limit: Number(limit),
          uid: user.uid
        }
      );

      setCategory("");
      setLimit("");

      Alert.alert(
        "Éxito",
        "Presupuesto agregado"
      );

    } catch (error) {

      Alert.alert(
        "Error",
        "No se pudo guardar"
      );

    }

  };

  // ELIMINAR

  const deleteBudget = (id) => {

    Alert.alert(
      "Eliminar",
      "¿Deseas eliminar este presupuesto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },

        {
          text: "Eliminar",

          onPress: async () => {

            try {

              await deleteDoc(
                doc(db, "budgets", id)
              );

            } catch (error) {

              Alert.alert(
                "Error",
                "No se pudo eliminar"
              );

            }

          }
        }
      ]
    );

  };

  return (

    <LinearGradient
      colors={["#0F172A", "#1E3A8A"]}
      style={styles.container}
    >

      <Text style={styles.title}>
        Presupuestos
      </Text>

      <TextInput
        placeholder="Categoría"
        placeholderTextColor="#94A3B8"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="Límite"
        placeholderTextColor="#94A3B8"
        value={limit}
        onChangeText={setLimit}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={addBudget}
      >

        <Text style={styles.buttonText}>
          Guardar Presupuesto
        </Text>

      </TouchableOpacity>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View>

              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.limit}>
                ${item.limit}
              </Text>

            </View>

            <TouchableOpacity
              onPress={() =>
                deleteBudget(item.id)
              }
            >

              <Text style={styles.delete}>
                Eliminar
              </Text>

            </TouchableOpacity>

          </View>

        )}

      />

    </LinearGradient>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },

  limit: {
    color: "#64748B",
    marginTop: 5,
    fontSize: 16,
  },

  delete: {
    color: "#EF4444",
    fontWeight: "bold",
  },

});