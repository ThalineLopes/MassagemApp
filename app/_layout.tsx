import { Tabs } from "expo-router";
import { useEffect } from "react";
import { initAgendamentos } from "../lib/database/agendamentoService";

export default function TabLayout() {
  useEffect(() => {
    initAgendamentos();
  }, []);
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cliente" options={{ title: "Agendar" }} />
      <Tabs.Screen name="meus-agendamentos" options={{ title: "Meus agendamentos" }} />
      <Tabs.Screen name="empresa" options={{ title: "Empresa" }} />
    </Tabs>
  );
}
