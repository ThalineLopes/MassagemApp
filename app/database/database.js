// import * as SQLite from "expo-sqlite";

// export const getDBConnection = () => {
//   return SQLite.openDatabase("agendamentos.db");
// };

// export const createTable = () => {
//   const db = getDBConnection();
//   db.transaction((tx) => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS agendamentos (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         data TEXT NOT NULL,
//         hora TEXT NOT NULL,
//         cliente TEXT
//       );`,
//       [],
//       () => console.log("Tabela criada com sucesso"),
//       (_, error) => {
//         console.log("Erro ao criar tabela", error);
//         return false;
//       },
//     );
//   });
// };
