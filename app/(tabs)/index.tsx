import { useState } from "react";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import "setimmediate";

export default function HomeScreen() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const fazerLogin = () => {
    alert(`Email: ${email}\nSenha: ${senha}`);
  };

  const image = { uri: "https://i.ibb.co/1GDXKdtv/fundo-png.webp" };

  return (
    <ImageBackground source={image} style={styles.container} resizeMode="cover">
      <View style={styles.card}>
        <Text style={styles.tituloPrincipal}>Espaço Selma Regina </Text>
        <Text style={styles.subtitulo}>Agende sua massagem</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Button title="Entrar" onPress={fazerLogin} color="#fafafa" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6D5C3",

    // maxWidth: 1200,
    // marginLeft: "auto",
    // marginRight: "auto",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#D9C2A3",
    padding: 25,
    borderRadius: 15,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    opacity: 0.9,
  },
  tituloPrincipal: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },

  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    color: "white",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
});
