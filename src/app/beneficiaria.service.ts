import { Injectable, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../environments/environment';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Beneficiaria } from './models';

@Injectable({ providedIn: 'root' })
export class BeneficiariaService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);

  private demo: Beneficiaria[] = [
    { id: 'demo-1', nome: 'Beneficiaria Exemplo A', telefone: '(33) 99999-0001', bairro: 'Bairro Modelo', data_nascimento: '1995-04-12', situacao_vulnerabilidade: 'gestante', necessidades: 'Acompanhamento pre-natal', criado_em: new Date().toISOString(), criado_por: 'demo-user' },
    { id: 'demo-2', nome: 'Beneficiaria Exemplo B', telefone: '(33) 99999-0002', bairro: 'Centro', data_nascimento: '1990-08-30', situacao_vulnerabilidade: 'mae_acompanhamento', criado_em: new Date().toISOString(), criado_por: 'demo-user' }
  ];

  async buscar(termo: string): Promise<Partial<Beneficiaria>[]> {
    termo = (termo ?? '').trim().toLowerCase();
    if (!termo) return [];
    if (environment.demo) {
      return this.demo.filter(b => b.nome.toLowerCase().includes(termo) || b.telefone.includes(termo))
        .slice(0, 20)
        .map(b => ({ id: b.id, nome: b.nome, bairro: b.bairro, telefone: b.telefone }));
    }
    const { data, error } = await this.supabase.from('beneficiaria')
      .select('id, nome, bairro, telefone')
      .or('nome.ilike.%' + termo + '%,telefone.ilike.%' + termo + '%')
      .order('nome').limit(20);
    if (error) throw error;
    return data ?? [];
  }
  async obter(id: string): Promise<Beneficiaria | null> {
    if (environment.demo) return this.demo.find(b => b.id === id) ?? null;
    const { data, error } = await this.supabase.from('beneficiaria').select('*').eq('id', id).single();
    return error ? null : data;
  }
  async cadastrar(b: Omit<Beneficiaria, 'id' | 'criado_em' | 'criado_por'>): Promise<Beneficiaria> {
    const reg: Beneficiaria = { ...b, id: uuidv4(), criado_em: new Date().toISOString(), criado_por: this.auth.userId };
    if (environment.demo) { this.demo.unshift(reg); return reg; }
    const { data, error } = await this.supabase.from('beneficiaria').insert(reg).select().single();
    if (error) throw error;
    return data;
  }
}