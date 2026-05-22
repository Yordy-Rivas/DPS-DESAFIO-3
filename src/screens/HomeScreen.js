import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

import { auth } from "../services/firebaseConfig";

import { transactions } from "../data/dummyData";

export default function HomeScreen({ navigation }) {

  const user = auth.currentUser;

  const userName = user?.email
    ? user.email.split("@")[0]
    : "Usuario";

  const totalIncome = transactions
    .filter(item => item.type === "Ingreso")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpense = transactions
    .filter(item => item.type === "Gasto")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalBalance =
    totalIncome - totalExpense;

  return (

    <LinearGradient
      colors={["#0F172A", "#1E3A8A"]}
      style={styles.container}
    >

      <StatusBar
        barStyle="light-content"
      />

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.greeting}>
            Hola, {userName} 👋
          </Text>

          <Text style={styles.subtitle}>
            Bienvenido nuevamente
          </Text>

        </View>

        <View style={styles.profileCircle}>

          <Ionicons
            name="person"
            size={28}
            color="#FFFFFF"
          />

        </View>

      </View>

      {/* BALANCE CARD */}

      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={styles.balanceCard}
      >

        <Text style={styles.balanceTitle}>
          Balance Total
        </Text>

        <Text style={styles.balanceAmount}>
          ${totalBalance}
        </Text>

      </LinearGradient>

      {/* INGRESOS Y GASTOS */}

      <View style={styles.statsContainer}>

        <View style={styles.statCard}>

          <Ionicons
            name="arrow-down-circle"
            size={35}
            color="#10B981"
          />

          <Text style={styles.statTitle}>
            Ingresos
          </Text>

          <Text style={styles.incomeText}>
            ${totalIncome}
          </Text>

        </View>

        <View style={styles.statCard}>

          <Ionicons
            name="arrow-up-circle"
            size={35}
            color="#EF4444"
          />

          <Text style={styles.statTitle}>
            Gastos
          </Text>

          <Text style={styles.expenseText}>
            ${totalExpense}
          </Text>

        </View>

      </View>

      {/* BOTÓN */}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate(
            "AddTransaction"
          )
        }
      >

        <Ionicons
          name="add"
          size={24}
          color="#FFFFFF"
        />

        <Text style={styles.addButtonText}>
          Agregar Transacción
        </Text>

      </TouchableOpacity>

      {/* HISTORIAL */}

      <Text style={styles.historyTitle}>
        Últimas Transacciones
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) =>
          item.id.toString()
        }

        showsVerticalScrollIndicator={false}

        renderItem={({ item }) => (

          <View style={styles.transactionCard}>

            <View>

              <Text style={styles.transactionTitle}>
                {item.title}
              </Text>

              <Text style={styles.transactionType}>
                {item.type}
              </Text>

            </View>

            <Text
              style={
                item.type === "Ingreso"
                  ? styles.incomeAmount
                  : styles.expenseAmount
              }
            >
              ${item.amount}
            </Text>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#CBD5E1",
    marginTop: 5,
    fontSize: 15,
  },

  profileCircle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  balanceCard: {
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
  },

  balanceTitle: {
    color: "#D1FAE5",
    fontSize: 18,
  },

  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 10,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  statTitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748B",
  },

  incomeText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },

  expenseText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "#EF4444",
  },

  addButton: {
    backgroundColor: "#10B981",
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },

  historyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },

  transactionType: {
    marginTop: 5,
    color: "#64748B",
  },

  incomeAmount: {
    color: "#10B981",
    fontSize: 20,
    fontWeight: "bold",
  },

  expenseAmount: {
    color: "#EF4444",
    fontSize: 20,
    fontWeight: "bold",
  },

});