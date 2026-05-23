import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";

import {
  PieChart
} from "react-native-chart-kit";

import {
  Dimensions
} from "react-native";

import { useEffect, useState } from "react";

import { auth, db } from "../services/firebaseConfig";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

import { Picker }
from "@react-native-picker/picker";

import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  signOut
} from "firebase/auth";

export default function HomeScreen({ navigation }) {

  const user = auth.currentUser;

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [income, setIncome] =
    useState(0);

  const [expense, setExpense] =
    useState(0);

  const [balance, setBalance] =
    useState(0);

  const [selectedCategory, setSelectedCategory] =
  useState("Todos");

  const [selectedType, setSelectedType] =
  useState("Todos");

  const [selectedAccount, setSelectedAccount] =
  useState("Todos");

  const [budgets, setBudgets] = useState({
  Comida: 150,
  Transporte: 100,
  Entretenimiento: 80,
});

  const userName = user?.email
    ? user.email.split("@")[0]
    : "Usuario";

  // CARGAR TRANSACCIONES

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid)
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        let list = [];

        let totalIncome = 0;

        let totalExpense = 0;

        snapshot.forEach((doc) => {

          const data = {
            id: doc.id,
            ...doc.data(),
          };

          list.push(data);

          if (data.type === "Ingreso") {

            totalIncome += data.amount;

          } else {

            totalExpense += data.amount;

          }

        });

        setTransactions(list);

        setIncome(totalIncome);

        setExpense(totalExpense);

        setBalance(
          totalIncome - totalExpense
        );

        setLoading(false);

      });

    return () => unsubscribe();

  }, []);

  const filteredTransactions =
  transactions.filter((item) => {

    const categoryMatch =
      selectedCategory === "Todos" ||
      item.category === selectedCategory;

    const typeMatch =
      selectedType === "Todos" ||
      item.type === selectedType;

    const accountMatch =
      selectedAccount === "Todos" ||
      item.account === selectedAccount;

    return (
      categoryMatch &&
      typeMatch &&
      accountMatch
    );

  });

  const expensesByCategory = {};

transactions.forEach((item) => {

  if (item.type === "Gasto") {

    if (!expensesByCategory[item.category]) {

      expensesByCategory[item.category] = 0;

    }

    expensesByCategory[item.category] += item.amount;

  }

});

const colors = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const chartData =
  Object.keys(expensesByCategory)
    .map((category, index) => ({

      name: category,

      amount:
        expensesByCategory[category],

      color:
        colors[index % colors.length],

      legendFontColor: "#FFFFFF",

      legendFontSize: 14,

    }));
  // ELIMINAR TRANSACCIÓN

  const deleteTransaction = (id) => {

    Alert.alert(
      "Eliminar",
      "¿Deseas eliminar esta transacción?",
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
                doc(
                  db,
                  "transactions",
                  id
                )
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

  const handleLogout = async () => {

  Alert.alert(
    "Cerrar Sesión",
    "¿Deseas cerrar sesión?",
    [

      {
        text: "Cancelar",
        style: "cancel"
      },

      {
        text: "Cerrar Sesión",

        onPress: async () => {

          try {

            await signOut(auth);

          } catch (error) {

            Alert.alert(
              "Error",
              "No se pudo cerrar sesión"
            );

          }

        }

      }

    ]
  );

};
  // LOADING

  if (loading) {

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#10B981"
        />

      </View>

    );
  }

  return (

    <ScrollView
      showsVerticalScrollIndicator={false}
    >

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

            <TouchableOpacity
              style={styles.profileCircle}
              onPress={handleLogout}
            >

            <Ionicons
              name="log-out-outline"
              size={28}
              color="#FFFFFF"
            />

            </TouchableOpacity>

        </View>

        {/* BALANCE */}

        <LinearGradient
          colors={["#10B981", "#059669"]}
          style={styles.balanceCard}
        >

          <Text style={styles.balanceTitle}>
            Balance Total
          </Text>

          <Text style={styles.balanceAmount}>

            {
              balance < 0
                ? `Excediste de tu presupuesto $${Math.abs(balance)}`
                : `$${balance}`
            }

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
              ${income}
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
              ${expense}
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
        {/* FILTROS */}

<Text style={styles.historyTitle}>
  Filtros
</Text>

<View style={styles.filterContainer}>

  {/* CATEGORÍA */}

  <View style={styles.filterBox}>

    <Picker
      selectedValue={selectedCategory}

      onValueChange={(value) =>
        setSelectedCategory(value)
      }

      style={styles.picker}
    >

      <Picker.Item
        label="Todas"
        value="Todos"
      />

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

    </Picker>

  </View>

  {/* TIPO */}

  <View style={styles.filterBox}>

    <Picker
      selectedValue={selectedType}

      onValueChange={(value) =>
        setSelectedType(value)
      }

      style={styles.picker}
    >

      <Picker.Item
        label="Todos"
        value="Todos"
      />

      <Picker.Item
        label="Ingreso"
        value="Ingreso"
      />

      <Picker.Item
        label="Gasto"
        value="Gasto"
      />

    </Picker>

  </View>

  {/* CUENTA */}

  <View style={styles.filterBox}>

    <Picker
      selectedValue={selectedAccount}

      onValueChange={(value) =>
        setSelectedAccount(value)
      }

      style={styles.picker}
    >

      <Picker.Item
        label="Todas"
        value="Todos"
      />

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

</View>

<Text style={styles.historyTitle}>
  Gastos por Categoría
</Text>

{
  chartData.length > 0 ? (

    <PieChart
      data={chartData}

      width={
        Dimensions.get("window").width - 40
      }

      height={220}

      chartConfig={{
        backgroundColor: "#1E3A8A",

        backgroundGradientFrom: "#1E3A8A",

        backgroundGradientTo: "#1E3A8A",

        color: (opacity = 1) =>
          `rgba(255,255,255,${opacity})`
      }}

      accessor={"amount"}

      backgroundColor={"transparent"}

      paddingLeft={"15"}

      absolute
    />

  ) : (

    <Text
      style={{
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 20
      }}
    >
      No hay gastos registrados
    </Text>

  )
}

<Text style={styles.historyTitle}>
  Presupuestos Mensuales
</Text>

{
  Object.keys(budgets).map((category) => {

    const spent =
      expensesByCategory[category] || 0;

    const limit =
      budgets[category];

    const percentage =
      spent / limit;

    let barColor = "#10B981";

    if (percentage >= 1) {

      barColor = "#EF4444";

    } else if (percentage >= 0.8) {

      barColor = "#F59E0B";

    }

    return (

      <View
        key={category}
        style={styles.budgetCard}
      >

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8
          }}
        >

          <Text style={styles.budgetTitle}>
            {category}
          </Text>

          <Text style={styles.budgetAmount}>
            ${spent} / ${limit} (
            {Math.round(percentage * 100)}%
            )
          </Text>

        </View>

        <View style={styles.progressBackground}>

          <View
            style={{
              height: "100%",
              width: `${Math.min(
                percentage * 100,
                100
              )}%`,
              backgroundColor: barColor,
              borderRadius: 10,
            }}
          />

        </View>

      </View>

    );

  })
}
<TouchableOpacity
  style={styles.addButton}
  onPress={() =>
    navigation.navigate("Budget")
  }
>
  <Ionicons
    name="wallet-outline"
    size={24}
    color="#FFFFFF"
  />

  <Text style={styles.addButtonText}>
    Administrar Presupuestos
  </Text>
</TouchableOpacity>

        <Text style={styles.historyTitle}>
          Últimas Transacciones
        </Text>

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}

          renderItem={({ item }) => (

            <View style={styles.transactionCard}>

              <View>

                <Text
                  style={styles.transactionTitle}
                >
                  {item.title}
                </Text>

                <Text
                  style={styles.transactionType}
                >
                  {item.category}
                </Text>

              </View>

              <View
                style={{
                  alignItems: "flex-end"
                }}
              >

                <Text
                  style={
                    item.type === "Ingreso"
                      ? styles.incomeAmount
                      : styles.expenseAmount
                  }
                >
                  ${item.amount}
                </Text>

                {/* EDITAR */}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      "AddTransaction",
                      {
                        transaction: item
                      }
                    )
                  }
                >

                  <Text
                    style={{
                      color: "#2563EB",
                      marginTop: 5,
                      fontWeight: "bold"
                    }}
                  >
                    Editar
                  </Text>

                </TouchableOpacity>

                {/* ELIMINAR */}

                <TouchableOpacity
                  onPress={() =>
                    deleteTransaction(item.id)
                  }
                >

                  <Text
                    style={{
                      color: "red",
                      marginTop: 5,
                      fontWeight: "bold"
                    }}
                  >
                    Eliminar
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          )}

        />

      </LinearGradient>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
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
    fontSize: 28,
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

  filterContainer: {
  marginBottom: 20,
},

filterBox: {
  backgroundColor: "#FFFFFF",
  borderRadius: 15,
  marginBottom: 15,
},

picker: {
  color: "#0F172A",
},

budgetCard: {
  backgroundColor: "#FFFFFF",
  padding: 15,
  borderRadius: 18,
  marginBottom: 15,
},

budgetTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#0F172A",
},

budgetAmount: {
  fontSize: 15,
  color: "#64748B",
},

progressBackground: {
  height: 14,
  backgroundColor: "#E2E8F0",
  borderRadius: 10,
  overflow: "hidden",
},
});