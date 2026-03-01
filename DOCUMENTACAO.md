# Massagem App — Documentação

## Visão geral

Aplicativo **Espaço Selma Regina** para agendamento de massagens. Possui três fluxos principais: **login/cadastro**, **área do cliente** (agendar horários) e **painel da empresa** (ver e cancelar agendamentos). Desenvolvido com **Expo (React Native)** e **expo-router**, funcionando em **web** e **mobile** (iOS/Android).

---

## Como rodar o projeto

- **Pré-requisito:** Node.js **20+** (recomendado 20.19+). Em versões antigas o `npm run web` pode falhar (`configs.toReversed is not a function`).
- Instalar dependências: `npm install`
- Desenvolvimento:
  - Web: `npm run web`
  - iOS: `npm run ios`
  - Android: `npm run android`
  - Geral: `npm start` (abre o menu Expo)

---

## Estrutura de pastas (principais)

```
app/
  _layout.tsx              # Layout com Tabs + init do banco
  (tabs)/
    index.tsx              # Tela de login / cadastro
    cliente.tsx            # Área do cliente — agendar
    empresa.tsx            # Painel da empresa — listar/cancelar
    explore.tsx            # Tela Explore (template)
lib/
  database/
    database.web.js        # Stub para web (não carrega SQLite/WASM)
    database.native.js     # Conexão SQLite (iOS/Android)
    agendamentoService.js  # CRUD de agendamentos (SQLite ou AsyncStorage)
```

---

## Fluxos do usuário

### 1. Login (Home — `app/(tabs)/index.tsx`)

- **Campo “Usuário”:** texto livre.
  - Se contiver **"empresa"** → redireciona para a aba **Empresa**.
  - Se contiver **"cliente"** ou for exatamente **"cliente"** → redireciona para a aba **Cliente**.
  - Caso contrário, trata como **email**: busca na lista de clientes cadastrados (AsyncStorage, chave `@clientes`). Se achar, vai para **Cliente**; senão mostra mensagem para usar "cliente"/"empresa" ou se cadastrar.
- **Cadastro:** link “Cadastrar cliente” abre campos Nome, Email e Senha. Os dados são salvos em AsyncStorage (`@clientes`) e o usuário é redirecionado para a aba **Cliente**.

Não há autenticação real; é um “fake login” por string e cadastro local.

### 2. Área do cliente (`app/(tabs)/cliente.tsx`)

- Calendário para escolher a **data**.
- Lista de **horários** fixos (08:00, 10:00, 14:00, 15:00, 16:00). Horários já agendados aparecem desabilitados.
- Botão **Agendar**: persiste o agendamento (data, hora, serviço “Massagem Relaxante”, nome “Cliente”) e recarrega a lista.
- Dados vêm do **agendamentoService** (mesma fonte que a empresa usa).

### 3. Painel da empresa (`app/(tabs)/empresa.tsx`)

- Lista todos os agendamentos agrupados por **data** (ordem cronológica).
- Para cada item: data, hora, serviço, nome do cliente (quando houver).
- **Cancelar:** remove o agendamento pelo `id` e recarrega a lista.
- Fonte dos dados: mesmo **agendamentoService** que o cliente usa.

---

## Persistência de dados

### Camada única: `app/database/agendamentoService.js`

Toda leitura/gravação de agendamentos passa por este serviço:

| Plataforma | Armazenamento | Chave / tabela |
|------------|----------------|----------------|
| **Web**    | AsyncStorage   | `@agendamentos` (array de objetos) |
| **iOS/Android** | SQLite   | Banco `agendamentos.db`, tabela `agendamentos` |

- **Web:** expo-sqlite não é usado; evita problemas de compatibilidade no browser.
- **Native:** na abertura do app, `_layout.tsx` chama `initAgendamentos()`, que chama `initDatabase()` em `lib/database/database.native.js` e cria a tabela se não existir.

### Formato dos agendamentos

Cada agendamento tem:

- `id` (number)
- `data` (string ISO, ex.: `"2026-03-05"`)
- `hora` (string, ex.: `"14:00"`)
- `servico` (string, padrão `"Massagem Relaxante"`)
- `cliente_nome` (string ou null)

No **AsyncStorage (web)** é guardado um **array** desses objetos. No **SQLite** a tabela tem as colunas equivalentes.

### Migração de dados antigos (web)

Se já existir em AsyncStorage o formato antigo (objeto por data, ex.: `{ "2026-03-05": [{ hora, servico }] }`), o serviço converte para o novo formato (array com `id`) na primeira leitura e reescreve em `@agendamentos`.

### Cadastro de clientes

- Armazenamento: **sempre AsyncStorage**, chave `@clientes`.
- Formato: array de `{ nome, email, senha }`.
- Usado apenas na tela de login para decidir se o texto digitado é um cliente cadastrado e redirecionar para a aba Cliente.

---

## Resumo da verificação de persistência

| Item | Comportamento |
|------|----------------|
| **Cliente agenda** | `addAgendamento()` grava no SQLite (native) ou no AsyncStorage (web). |
| **Empresa vê os mesmos dados** | `getAgendamentos()` lê da mesma fonte (SQLite ou AsyncStorage). |
| **Empresa cancela** | `cancelarAgendamento(id)` remove por ID; cliente passa a ver o horário livre de novo. |
| **Cadastro de cliente** | Salvo em `@clientes` (AsyncStorage); login por email usa essa lista. |
| **Web** | Sem SQLite; apenas AsyncStorage. Dados persistem no localStorage do navegador. |
| **Native** | SQLite; dados persistem no dispositivo entre sessões. |

Para conferir na prática:

1. **Web:** abra o app, faça login com "cliente", agende um horário, mude para a aba Empresa — o agendamento deve aparecer. Recarregue a página e verifique se continua lá (AsyncStorage).
2. **Mobile:** mesmo fluxo; fechar e reabrir o app deve manter os agendamentos (SQLite).

---

## Observação sobre `npm run web`

Se aparecer:

```text
TypeError: configs.toReversed is not a function
```

significa que o **Node.js** é anterior à versão em que `Array.prototype.toReversed` existe. Use **Node 20+** (idealmente 20.19+). Verifique com `node -v` e, se precisar, use `nvm` ou instale uma versão mais recente do Node.

---

## Tecnologias principais

- **Expo** ~54
- **expo-router** (rotas e Tabs)
- **expo-sqlite** (persistência em iOS/Android)
- **@react-native-async-storage/async-storage** (web e cadastro de clientes)
- **react-native-calendars** (calendário na tela Cliente)
- **React Native** 0.81 / **React** 19

---

*Documentação gerada para o projeto Massagem App (Espaço Selma Regina).*
