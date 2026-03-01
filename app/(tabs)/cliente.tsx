import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { addAgendamento, getAgendamentos } from "../../lib/database/agendamentoService";
import { SERVICOS_MASSOTERAPIA } from "../../constants/servicos";

const CURRENT_USER_KEY = "@currentUser";

export default function Cliente() {
  const router = useRouter();
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState<string>(SERVICOS_MASSOTERAPIA[0]);
  const [agendamentos, setAgendamentos] = useState<{ [data: string]: string[] }>({});
  const [nomeCliente, setNomeCliente] = useState<string>("Cliente");
  const [quantidadeMeusAgendamentos, setQuantidadeMeusAgendamentos] = useState(0);

  const carregar = useCallback(async () => {
    try {
      const dados = await getAgendamentos();
      const agsFormatados: { [data: string]: string[] } = {};
      dados.forEach((item) => {
        if (!agsFormatados[item.data]) agsFormatados[item.data] = [];
        agsFormatados[item.data].push(item.hora);
      });
      setAgendamentos(agsFormatados);
      const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
      const nome = raw ? (JSON.parse(raw).nome || "") : "";
      const meus = dados.filter((item) => (item.cliente_nome || "").trim() === nome.trim());
      setQuantidadeMeusAgendamentos(meus.length);
    } catch (e) {
      console.warn("Erro ao carregar agendamentos:", e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (raw) {
          const u = JSON.parse(raw);
          setNomeCliente(u.nome || "Cliente");
        }
      } catch (_) {}
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const image = {
    uri: "https://i.ibb.co/1GDXKdtv/fundo-png.webp",
  };

  const agendarHorario = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      setMensagem("Selecione data e horário");
      return;
    }
    const horariosDaData = agendamentos[dataSelecionada] || [];
    if (horariosDaData.includes(horarioSelecionado)) {
      setMensagem("Esse horário já está agendado!");
      return;
    }
    try {
      await addAgendamento(dataSelecionada, horarioSelecionado, nomeCliente, servicoSelecionado);
      await carregar();
      setHorarioSelecionado("");
      router.replace("/(tabs)/meus-agendamentos");
    } catch (e) {
      setMensagem("Erro ao salvar. Tente novamente.");
    }
  };

  const horariosDaData = agendamentos[dataSelecionada] || [];

  return (
    <ImageBackground
      source={image}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.titulo}>Área do cliente</Text>
          <Text style={styles.subtitulo}>Agende sua massagem aqui 🌿</Text>
          <Text style={styles.reservandoComo}>Reservando como: <Text style={styles.nomeCliente}>{nomeCliente}</Text></Text>

          <View style={styles.calendarioContainer}>
            <Calendar
              onDayPress={(day) => {
                setDataSelecionada(day.dateString);
                setHorarioSelecionado("");
                setMensagem("");
              }}
              markedDates={{
                [dataSelecionada]: { selected: true, selectedColor: "#7FB8A4" },
              }}
              theme={{
                backgroundColor: "#FFFFFF",
                calendarBackground: "#F5EBDD",
                textSectionTitleColor: "#2F5D50",
                selectedDayBackgroundColor: "#7FB8A4",
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: "#2F5D50",
                dayTextColor: "#2F5D50",
                textDisabledColor: "#C5C5C5",
                monthTextColor: "white",
              }}
            />
          </View>

          <View style={styles.horariosContainer}>
            {["08:00", "10:00", "14:00", "15:00", "16:00"].map((hora) => {
              const estaAgendado = horariosDaData.includes(hora);
              return (
                <TouchableOpacity
                  key={hora}
                  disabled={estaAgendado}
                  style={[
                    styles.horarioBotao,
                    horarioSelecionado === hora && styles.horarioSelecionado,
                    estaAgendado && { backgroundColor: "#ccc" },
                  ]}
                  onPress={() => setHorarioSelecionado(hora)}
                >
                  <Text style={styles.horarioTexto}>{hora}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.labelServico}>Serviço</Text>
          <View style={styles.servicosContainer}>
            {SERVICOS_MASSOTERAPIA.map((serv) => (
              <TouchableOpacity
                key={serv}
                style={[
                  styles.servicoBotao,
                  servicoSelecionado === serv && styles.servicoSelecionado,
                ]}
                onPress={() => setServicoSelecionado(serv)}
              >
                <Text style={styles.servicoTexto}>{serv}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.botao} onPress={agendarHorario}>
            <Text style={styles.textoBotao}>Agendar</Text>
          </TouchableOpacity>

          {quantidadeMeusAgendamentos > 0 && (
            <TouchableOpacity
              style={styles.botaoVerMeus}
              onPress={() => router.replace("/(tabs)/meus-agendamentos")}
            >
              <Text style={styles.textoBotaoVerMeus}>
                Ver meus agendamentos ({quantidadeMeusAgendamentos})
              </Text>
            </TouchableOpacity>
          )}

          {mensagem !== "" && <Text style={styles.mensagem}>{mensagem}</Text>}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    width: "90%",
    maxWidth: 450,
    backgroundColor: "#D9C2A3",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    opacity: 0.9,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  subtitulo: { marginBottom: 8, color: "#DDEFE8" },
  reservandoComo: { marginBottom: 12, color: "#f5f5f5", fontSize: 14 },
  nomeCliente: { fontWeight: "bold", color: "#fff" },
  calendarioContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    width: "100%",
  },
  horariosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  horarioBotao: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#BFA88E",
  },
  horarioSelecionado: { backgroundColor: "#aac9be" },
  horarioTexto: { color: "white", fontWeight: "bold" },
  labelServico: { marginBottom: 8, color: "#f5f5f5", fontSize: 14, alignSelf: "flex-start" },
  servicosContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 },
  servicoBotao: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#BFA88E",
  },
  servicoSelecionado: { backgroundColor: "#7FB8A4" },
  servicoTexto: { color: "white", fontSize: 13, fontWeight: "600" },
  botao: {
    backgroundColor: "#BFA88E",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 10,
  },
  textoBotao: { color: "#ffffff", fontWeight: "bold" },
  botaoVerMeus: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#7FB8A4",
  },
  textoBotaoVerMeus: { color: "#2F5D50", fontWeight: "600", fontSize: 15 },
  mensagem: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#DDEFE8",
    textAlign: "center",
  },
});
