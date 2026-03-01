import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAgendamentos } from "../../lib/database/agendamentoService";

const CURRENT_USER_KEY = "@currentUser";

type AgendamentoItem = {
  id: number;
  data: string;
  hora: string;
  servico: string;
  cliente_nome: string | null;
};

export default function MeusAgendamentos() {
  const router = useRouter();
  const [nomeCliente, setNomeCliente] = useState("");
  const [lista, setLista] = useState<AgendamentoItem[]>([]);

  const carregar = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
      const nome = raw ? (JSON.parse(raw).nome || "") : "";
      setNomeCliente(nome);
      const todos = await getAgendamentos();
      const meus = todos.filter((a) => (a.cliente_nome || "").trim() === nome.trim());
      setLista(meus.sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora)));
    } catch (e) {
      console.warn("Erro ao carregar:", e);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const formatarData = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const sair = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    router.replace("/");
  };

  const entrarEmContato = () => {
    Linking.openURL("https://wa.me/5511999999999").catch(() => {});
  };

  const image = { uri: "https://i.ibb.co/1GDXKdtv/fundo-png.webp" };

  return (
    <ImageBackground source={image} style={styles.background} resizeMode="cover">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.titulo}>Meus agendamentos</Text>
          {nomeCliente ? (
            <Text style={styles.subtitulo}>Olá, {nomeCliente}</Text>
          ) : null}

          {lista.length === 0 ? (
            <>
              <Text style={styles.vazio}>Você ainda não tem agendamentos.</Text>
              <Text style={styles.vazioDica}>Faça um novo agendamento na aba Cliente.</Text>
            </>
          ) : (
            lista.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemData}>{formatarData(item.data)} às {item.hora}</Text>
                <Text style={styles.itemServico}>{item.servico}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.rodape}>
        <TouchableOpacity
          style={styles.botaoRodape}
          onPress={() => router.replace("/(tabs)/cliente")}
        >
          <Text style={styles.botaoRodapeTexto}>Novo agendamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botaoRodape, styles.botaoSecundario]} onPress={entrarEmContato}>
          <Text style={styles.botaoRodapeTexto}>Entrar em contato</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botaoRodape, styles.botaoSair]} onPress={sair}>
          <Text style={styles.botaoSairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scroll: { flexGrow: 1, paddingVertical: 24, paddingHorizontal: 20, paddingBottom: 180 },
  card: {
    backgroundColor: "#D9C2A3",
    padding: 20,
    borderRadius: 16,
    opacity: 0.95,
  },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  subtitulo: { fontSize: 14, color: "#f5f5f5", marginBottom: 16 },
  vazio: { textAlign: "center", color: "#f5f5f5", marginTop: 20 },
  vazioDica: { textAlign: "center", color: "#ddd", fontSize: 13, marginTop: 8 },
  item: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemData: { fontWeight: "bold", color: "#2F5D50", fontSize: 15 },
  itemServico: { color: "#444", marginTop: 4 },
  rodape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "rgba(217, 194, 163, 0.98)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
  },
  botaoRodape: {
    backgroundColor: "#7FB8A4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoSecundario: { backgroundColor: "#BFA88E" },
  botaoSair: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#8B6914" },
  botaoRodapeTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  botaoSairTexto: { color: "#2F5D50", fontWeight: "bold", fontSize: 15 },
});
