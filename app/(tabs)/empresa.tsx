import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Agendamento = {
  hora: string;
  servico: string;
};

export default function Empresa() {
  const [agendamentos, setAgendamentos] = useState<{
    [data: string]: Agendamento[];
  }>({});

  const carregarAgendamentos = async () => {
    try {
      const dados = await AsyncStorage.getItem("@agendamentos");

      if (dados !== null) {
        const dadosParse = JSON.parse(dados);

        // 🔥 Converte formato antigo automaticamente
        const dadosConvertidos: { [data: string]: Agendamento[] } = {};

        Object.entries(dadosParse).forEach(([data, lista]: any) => {
          dadosConvertidos[data] = lista.map((item: any) => {
            if (typeof item === "string") {
              // formato antigo
              return {
                hora: item,
                servico: "Serviço não informado",
              };
            }
            return item;
          });
        });

        setAgendamentos(dadosConvertidos);
        await AsyncStorage.setItem(
          "@agendamentos",
          JSON.stringify(dadosConvertidos),
        );
      } else {
        const agendamentosIniciais = {
          "2026-03-05": [{ hora: "14:00", servico: "Massagem Relaxante" }],
          "2026-03-06": [{ hora: "09:30", servico: "Drenagem Linfática" }],
        };

        await AsyncStorage.setItem(
          "@agendamentos",
          JSON.stringify(agendamentosIniciais),
        );

        setAgendamentos(agendamentosIniciais);
      }
    } catch (error) {
      console.log("Erro ao carregar:", error);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  function cancelarHorario(data: string, hora: string) {
    const novosAgendamentos = { ...agendamentos };

    novosAgendamentos[data] = novosAgendamentos[data].filter(
      (item) => item.hora !== hora,
    );

    if (novosAgendamentos[data].length === 0) {
      delete novosAgendamentos[data];
    }

    setAgendamentos(novosAgendamentos);
    AsyncStorage.setItem("@agendamentos", JSON.stringify(novosAgendamentos));
  }

  function formatarData(dataISO: string) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Painel da Empresa</Text>

      {Object.keys(agendamentos).length === 0 && (
        <Text style={styles.semAgendamento}>Nenhum agendamento ainda.</Text>
      )}

      {Object.entries(agendamentos).map(([data, lista]) => (
        <View key={data} style={styles.card}>
          <Text style={styles.data}>{formatarData(data)}</Text>

          {lista.map((item) => (
            <View key={item.hora} style={styles.linhaHorario}>
              <View>
                <Text style={styles.horario}>Horário: {item.hora}</Text>
                <Text style={styles.servico}>Serviço: {item.servico}</Text>
              </View>

              <Text
                style={styles.botaoCancelar}
                onPress={() => cancelarHorario(data, item.hora)}
              >
                Cancelar
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linhaHorario: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  botaoCancelar: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },

  container: {
    padding: 20,
    paddingTop: 60,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  semAgendamento: {
    textAlign: "center",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#D9C2A3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  data: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },

  horario: {
    fontWeight: "bold",
  },

  servico: {
    color: "#444",
  },
});
