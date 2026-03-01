import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { cancelarAgendamento, getAgendamentos } from "../../lib/database/agendamentoService";

type AgendamentoItem = {
  id: number;
  data: string;
  hora: string;
  servico: string;
  cliente_nome: string | null;
};

export default function Empresa() {
  const [lista, setLista] = useState<AgendamentoItem[]>([]);

  const carregar = useCallback(async () => {
    try {
      const dados = await getAgendamentos();
      setLista(dados);
    } catch (e) {
      console.warn("Erro ao carregar:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function cancelar(id: number) {
    try {
      await cancelarAgendamento(id);
      await carregar();
    } catch (e) {
      console.warn("Erro ao cancelar:", e);
    }
  }

  const porData = lista.reduce<Record<string, AgendamentoItem[]>>((acc, item) => {
    if (!acc[item.data]) acc[item.data] = [];
    acc[item.data].push(item);
    return acc;
  }, {});
  const datasOrdenadas = Object.keys(porData).sort();

  function formatarData(dataISO: string) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Painel da Empresa</Text>

      {lista.length === 0 && (
        <Text style={styles.semAgendamento}>Nenhum agendamento ainda.</Text>
      )}

      {datasOrdenadas.map((data) => (
        <View key={data} style={styles.card}>
          <Text style={styles.data}>{formatarData(data)}</Text>
          {(porData[data] || []).map((item) => (
            <View key={item.id} style={styles.linhaHorario}>
              <View>
                <Text style={styles.horario}>Horário: {item.hora}</Text>
                <Text style={styles.servico}>Serviço: {item.servico}</Text>
                {item.cliente_nome && (
                  <Text style={styles.cliente}>Cliente: {item.cliente_nome}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => cancelar(item.id)}>
                <Text style={styles.botaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
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

  servico: { color: "#444" },
  cliente: { color: "#555", marginTop: 2, fontSize: 13 },
});
