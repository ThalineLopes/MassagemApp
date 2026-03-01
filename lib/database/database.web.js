/**
 * Versão web: não usa SQLite (evita carregar wa-sqlite.wasm).
 * O agendamentoService usa AsyncStorage na web.
 */

export const getDBConnection = () => null;

export const createTable = async () => {};

export const initDatabase = async () => {};
