export interface Voluntaria { id: string; nome: string; email: string; perfil: 'coordenacao' | 'voluntaria'; ativo: boolean; }
export interface Beneficiaria {
  id: string; nome: string; telefone: string; bairro: string;
  data_nascimento: string; situacao_vulnerabilidade: string;
  necessidades?: string; criado_em: string; criado_por: string;
}
export type TipoAtendimento = 'acompanhamento' | 'acolhimento' | 'entrega';
export interface Atendimento {
  id: string; beneficiaria_id: string; voluntaria_id: string;
  data_atendimento: string; tipo: TipoAtendimento; observacao?: string;
}