import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "setimmediate";

const CLIENTES_KEY = "@clientes";
const CURRENT_USER_KEY = "@currentUser";

export default function HomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  const fazerLogin = async () => {
    const user = (email || "").trim().toLowerCase();
    if (!user) {
      setMensagem("Digite o usuário.");
      return;
    }
    if (user.includes("empresa")) {
      router.replace("/(tabs)/empresa");
      return;
    }
    if (user.includes("cliente") || user === "cliente") {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ nome: "Cliente", email: "" }));
      router.replace("/(tabs)/cliente");
      return;
    }
    await getClientesAndGo(user);
  };

  const getClientesAndGo = async (emailLower: string) => {
    try {
      const raw = await AsyncStorage.getItem(CLIENTES_KEY);
      const clientes = raw ? JSON.parse(raw) : [];
      const existe = clientes.find((c) => (c.email || "").trim().toLowerCase() === emailLower);
      if (existe) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ nome: existe.nome, email: existe.email }));
        router.replace("/(tabs)/cliente");
        return;
      }
    } catch (_) {}
    setMensagem("Usuário não encontrado. Use 'cliente' ou 'empresa' para entrar.");
  };

  const fazerCadastro = async () => {
    const n = nome.trim();
    const e = (email || "").trim().toLowerCase();
    const s = senha.trim();
    if (!n || !e || !s) {
      setMensagem("Preencha nome, usuário e senha.");
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(CLIENTES_KEY);
      const clientes = raw ? JSON.parse(raw) : [];
      if (clientes.some((c) => (c.email || "").trim().toLowerCase() === e)) {
        setMensagem("Este usuário já está cadastrado.");
        return;
      }
      clientes.push({ nome: n, email: e, senha: s });
      await AsyncStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
      setModoCadastro(false);
      setNome("");
      setEmail("");
      setSenha("");
      setMensagem("Cadastro realizado! Faça login com seu usuário.");
    } catch (_) {
      setMensagem("Erro ao cadastrar.");
    }
  };

  const image = { uri: "https://i.ibb.co/1GDXKdtv/fundo-png.webp" };

  return (
    <ImageBackground source={image} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.tituloPrincipal}>Espaço Selma Regina</Text>
          <Text style={styles.subtitulo}>Agende sua massagem</Text>

          {!modoCadastro ? (
            <>
              <Text style={styles.dica}>
                Digite <Text style={styles.dicaBold}>cliente</Text> ou{" "}
                <Text style={styles.dicaBold}>empresa</Text> para entrar.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Usuário (cliente, empresa ou seu email)"
                value={email}
                onChangeText={(t) => { setEmail(t); setMensagem(""); }}
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                onSubmitEditing={fazerLogin}
                returnKeyType="go"
                onKeyPress={Platform.OS === "web" ? (e) => { if (e.nativeEvent?.key === "Enter") fazerLogin(); } : undefined}
              />
              <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.link}
                onPress={() => { setModoCadastro(true); setMensagem(""); }}
              >
                <Text style={styles.linkTexto}>Cadastrar cliente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.dica}>Cadastro só para clientes. A empresa é única.</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Usuário (email)"
                value={email}
                onChangeText={(t) => { setEmail(t); setMensagem(""); }}
                keyboardType="email-address"
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                onSubmitEditing={fazerCadastro}
                returnKeyType="go"
                onKeyPress={Platform.OS === "web" ? (e) => { if (e.nativeEvent?.key === "Enter") fazerCadastro(); } : undefined}
              />
              <TouchableOpacity style={styles.botao} onPress={fazerCadastro}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.link}
                onPress={() => { setModoCadastro(false); setMensagem(""); }}
              >
                <Text style={styles.linkTexto}>Voltar ao login</Text>
              </TouchableOpacity>
            </>
          )}

          {mensagem !== "" && <Text style={styles.mensagem}>{mensagem}</Text>}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6D5C3" },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#D9C2A3",
    padding: 25,
    borderRadius: 15,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    opacity: 0.95,
  },
  tituloPrincipal: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  subtitulo: { fontSize: 16, textAlign: "center", marginBottom: 15, color: "white" },
  dica: { fontSize: 13, textAlign: "center", marginBottom: 12, color: "#f5f5f5" },
  dicaBold: { fontWeight: "bold", color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  botao: {
    backgroundColor: "#7FB8A4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 16, alignItems: "center" },
  linkTexto: { color: "#2F5D50", fontSize: 14, fontWeight: "600" },
  mensagem: {
    marginTop: 14,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    color: "#fff",
    textAlign: "center",
    fontSize: 13,
  },
});
