import { getDBConnection, initDatabase } from "./database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "@agendamentos";

/**
 * @typedef {{ id: number; data: string; hora: string; servico: string; cliente_nome: string | null }} Agendamento
 */

function useSQLite() {
  return Platform.OS !== "web" && getDBConnection() != null;
}

export async function initAgendamentos() {
  if (useSQLite()) await initDatabase();
}

async function getFromStorage() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    // Migrar formato antigo: { [data]: [{ hora, servico }] } -> lista com id
    const list = [];
    let id = 1;
    Object.entries(parsed).forEach(([data, arr]) => {
      (arr || []).forEach((item) => {
        const hora = typeof item === "string" ? item : item.hora;
        const servico = typeof item === "string" ? "Massagem Relaxante" : (item.servico || "Massagem Relaxante");
        list.push({ id: id++, data, hora, servico, cliente_nome: null });
      });
    });
    if (list.length) setToStorage(list);
    return list;
  } catch {
    return [];
  }
}

async function setToStorage(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** @returns {Promise<Agendamento[]>} */
export async function getAgendamentos() {
  if (useSQLite()) {
    const db = getDBConnection();
    const rows = await db.getAllAsync(
      "SELECT id, data, hora, servico, cliente_nome FROM agendamentos ORDER BY data, hora"
    );
    return rows.map((r) => ({
      id: r.id,
      data: r.data,
      hora: r.hora,
      servico: r.servico || "Massagem Relaxante",
      cliente_nome: r.cliente_nome ?? null,
    }));
  }
  return getFromStorage();
}

/**
 * @param {string} data
 * @param {string} hora
 * @param {string} [clienteNome]
 * @param {string} [servico]
 */
export async function addAgendamento(data, hora, clienteNome = null, servico = "Massagem Relaxante") {
  if (useSQLite()) {
    const db = getDBConnection();
    await db.runAsync(
      "INSERT INTO agendamentos (data, hora, servico, cliente_nome) VALUES (?, ?, ?, ?)",
      data,
      hora,
      servico,
      clienteNome ?? ""
    );
    return;
  }
  const list = await getFromStorage();
  const newId = list.length ? Math.max(...list.map((a) => a.id)) + 1 : 1;
  list.push({ id: newId, data, hora, servico, cliente_nome: clienteNome });
  await setToStorage(list);
}

/**
 * @param {number} id
 */
export async function cancelarAgendamento(id) {
  if (useSQLite()) {
    const db = getDBConnection();
    await db.runAsync("DELETE FROM agendamentos WHERE id = ?", id);
    return;
  }
  const list = await getFromStorage();
  await setToStorage(list.filter((a) => a.id !== id));
}
