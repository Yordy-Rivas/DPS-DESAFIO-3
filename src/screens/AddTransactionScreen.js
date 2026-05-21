import {
  View,
  Text,
  TextInput,
  Button
} from "react-native";

export default function AddTransactionScreen() {

  return (

    <View style={{
      padding: 20,
      marginTop: 50
    }}>

      <Text style={{
        fontSize: 30
      }}>
        Nueva Transacción
      </Text>

      <TextInput
        placeholder="Título"
        style={{
          borderWidth: 1,
          marginTop: 20,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          marginTop: 20,
          padding: 10
        }}
      />

      <Button title="Guardar" />

    </View>
  );
}