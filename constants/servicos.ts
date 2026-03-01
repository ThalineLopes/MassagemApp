/** Serviços de massoterapia disponíveis para agendamento */
export const SERVICOS_MASSOTERAPIA = [
  "Massagem Relaxante",
  "Drenagem Linfática",
  "Massagem Terapêutica",
] as const;

export type ServicoNome = (typeof SERVICOS_MASSOTERAPIA)[number];
