import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  auth,
  db
} from "../services/firebaseConfig";

import { Ionicons }
from "@expo/vector-icons";

export default function AccountsScreen({
  navigation
}) {

  const [accounts, setAccounts] =
    useState([]);

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "accounts"),
      where("uid", "==", user.uid)
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        let list = [];

        snapshot.forEach((doc) => {

          list.push({
            id: doc.id,
            ...doc.data(),
          });

        });

        setAccounts(list);

      });

    return () => unsubscribe();

  }, []);

  const deleteAccount = (id) => {

    Alert.alert(
      "Eliminar",
      "¿Deseas eliminar esta cuenta?",
      [

        {
          text: "Cancelar",
          style: "cancel"
        },

        {
          text: "Eliminar",

          style: "destructive",

          onPress: async () => {

            try {

              await deleteDoc(
                doc(db, "accounts", id)
              );

            } catch {

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

    <View style={styles.container}>

      <Text style={styles.title}>
        Mis Cuentas
      </Text>

      <FlatList
        data={accounts}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.balance}>
                Saldo: ${item.balance}
              </Text>

            </View>

            <View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "AddAccount",
                    { account: item }
                  )
                }
              >

                <Text style={styles.edit}>
                  Editar
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  deleteAccount(item.id)
                }
              >

                <Text style={styles.delete}>
                  Eliminar
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        )}

      />

      <TouchableOpacity
        style={styles.button}

        onPress={() =>
          navigation.navigate(
            "AddAccount"
          )
        }
      >

        <Ionicons
          name="add"
          size={24}
          color="#FFF"
        />

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
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  balance: {
    marginTop: 5,
    color: "#64748B",
  },

  edit: {
    color: "#2563EB",
    fontWeight: "bold",
    marginBottom: 10,
  },

  delete: {
    color: "#EF4444",
    fontWeight: "bold",
  },

  button: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#10B981",
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

});