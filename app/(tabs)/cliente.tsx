import { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
// import { addAgendamento } from "../database/agendamentoService";

export default function Cliente() {
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [agendamentos, setAgendamentos] = useState<{
    [data: string]: string[];
  }>({});

  // Inicializa DB e carrega agendamentos
  useEffect(() => {
    // const initDB = () => {
    //   // createTable(); // cria tabela se não existir
    //   getAgendamentos()
    //     .then((dados) => {
    //       const agsFormatados: { [data: string]: string[] } = {};
    //       dados.forEach((item) => {
    //         if (!agsFormatados[item.data]) agsFormatados[item.data] = [];
    //         agsFormatados[item.data].push(item.hora);
    //       });
    //       setAgendamentos(agsFormatados);
    //     })
    //     .catch((error) => console.log("Erro ao carregar agendamentos:", error));
    // };
    // initDB();
  }, []);

  const image = {
    uri: "https://i.ibb.co/1GDXKdtv/fundo-png.webp",
  };

  // Função para agendar horário
  const agendarHorario = () => {
    if (!dataSelecionada || !horarioSelecionado) {
      setMensagem("Selecione data e horário");
      return;
    }

    const horariosDaData = agendamentos[dataSelecionada] || [];
    if (horariosDaData.includes(horarioSelecionado)) {
      setMensagem("Esse horário já está agendado!");
      return;
    }

    // addAgendamento(dataSelecionada, horarioSelecionado, "Cliente X"); // insere no DB

    const novosAgendamentos = {
      ...agendamentos,
      [dataSelecionada]: [...horariosDaData, horarioSelecionado],
    };
    setAgendamentos(novosAgendamentos);

    setMensagem(
      `Massagem agendada para ${dataSelecionada} às ${horarioSelecionado}`,
    );
    setHorarioSelecionado("");
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

          <TouchableOpacity style={styles.botao} onPress={agendarHorario}>
            <Text style={styles.textoBotao}>Agendar</Text>
          </TouchableOpacity>

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
  subtitulo: { marginBottom: 15, color: "#DDEFE8" },
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
  botao: {
    backgroundColor: "#BFA88E",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
  },
  textoBotao: { color: "#ffffff", fontWeight: "bold" },
  mensagem: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#DDEFE8",
    textAlign: "center",
  },
});
