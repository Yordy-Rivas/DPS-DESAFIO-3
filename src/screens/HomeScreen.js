import {
  View,
  Text,
  FlatList,
  Button
} from "react-native";

import { transactions } from "../data/dummyData";

export default function HomeScreen({ navigation }) {

  return (

    <View style={{
      padding: 20,
      marginTop: 50
    }}>

      <Text style={{
        fontSize: 30
      }}>
        Finanzas App
      </Text>

      <Text style={{
        marginTop: 20,
        fontSize: 20
      }}>
        Balance Total: $845
      </Text>

      <Button
        title="Agregar Transacción"
        onPress={() =>
          navigation.navigate(
            "AddTransaction"
          )
        }
      />

      <FlatList
        data={transactions}
        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={{
            borderWidth: 1,
            marginTop: 10,
            padding: 15,
            borderRadius: 10
          }}>

            <Text>{item.title}</Text>

            <Text>${item.amount}</Text>

            <Text>{item.type}</Text>

          </View>
        )}
      />

    </View>
  );
}