import * as SQLite from "expo-sqlite";

let db = null;

export const getDBConnection = () => {
  if (db) return db;
  db = SQLite.openDatabaseSync("agendamentos.db");
  return db;
};

export const createTable = async () => {
  const database = getDBConnection();
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      hora TEXT NOT NULL,
      servico TEXT DEFAULT 'Massagem Relaxante',
      cliente_nome TEXT
    );`
  );
};

export const initDatabase = async () => {
  const database = getDBConnection();
  await createTable();
};
