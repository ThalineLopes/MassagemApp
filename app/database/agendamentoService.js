// // agendamentoService.ts
// import { getDBConnection } from './database';

// // Tipo de agendamento
// export type Agendamento = {
//   id: number;
//   data: string;
//   hora: string;
//   cliente: string;
// };

// // Adicionar um agendamento
// export const addAgendamento = (data: string, hora: string, cliente: string): void => {
//   const db = getDBConnection();
//   db.transaction(tx => {
//     tx.executeSql(
//       'INSERT INTO agendamentos (data, hora, cliente) VALUES (?, ?, ?)',
//       [data, hora, cliente],
//       () => console.log('Agendamento inserido com sucesso'),
//       (_, error) => {
//         console.log('Erro ao inserir agendamento:', error);
//         return false;
//       }
//     );
//   });
// };

// // Buscar todos os agendamentos
// export const getAgendamentos = (): Promise<Agendamento[]> => {
//   const db = getDBConnection();
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM agendamentos ORDER BY data, hora',
//         [],
//         (_, result) => {
//           const ags: Agendamento[] = [];
//           for (let i = 0; i < result.rows.length; i++) {
//             ags.push(result.rows.item(i));
//           }
//           resolve(ags);
//         },
//         (_, error) => {
//           console.log('Erro ao buscar agendamentos:', error);
//           reject(error);
//           return false;
//         }
//       );
//     });
//   });
// };

// // Cancelar um agendamento pelo ID
// export const cancelarAgendamento = (id: number): void => {
//   const db = getDBConnection();
//   db.transaction(tx => {
//     tx.executeSql(
//       'DELETE FROM agendamentos WHERE id = ?',
//       [id],
//       () => console.log('Agendamento cancelado'),
//       (_, error) => {
//         console.log('Erro ao cancelar agendamento:', error);
//         return false;
//       }
//     );
//   });
// };
