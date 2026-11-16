import { Injectable, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../environments/environment';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Atendimento, TipoAtendimento } from './models';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);

  private demo: Atendimento[] = [
    { id: 'at-1', beneficiaria_id: 'demo-1', voluntaria_id: 'demo-user', data_atendimento: '2026-06-03T14:00:00', tipo: 'acolhimento', observacao: 'Primeiro contato. Retorno agendado.' },
    { id: 'at-2', beneficiaria_id: 'demo-1', voluntaria_id: 'demo-user', data_atendimento: '2026-06-10T10:00:00', tipo: 'acompanhamento', observacao: 'Participacao confirmada na atividade.' }
  ];

  async registrar(input: { beneficiaria_id: string; tipo: TipoAtendimento; observacao?: string; data?: string })
    : Promise<{ ok: boolean; offline: boolean }> {
    const registro: Atendimento = {
      id: uuidv4(),
      beneficiaria_id: input.beneficiaria_id,
      voluntaria_id: this.auth.userId,
      data_atendimento: input.data ?? new Date().toISOString(),
      tipo: input.tipo,
      observacao: input.observacao || undefined
    };
    if (environment.demo) { this.demo.unshift(registro); return { ok: true, offline: false }; }
    if (navigator.onLine) {
      const { error } = await this.supabase.from('atendimento').insert(registro);
      if (!error) return { ok: true, offline: false };
    }
    return { ok: false, offline: true }; // MVP sem sync offline: mostra erro claro
  }

  async historico(beneficiariaId: string): Promise<Atendimento[]> {
    if (environment.demo) {
      return this.demo.filter(a => a.beneficiaria_id === beneficiariaId)
        .sort((a, b) => b.data_atendimento.localeCompare(a.data_atendimento));
    }
    const { data, error } = await this.supabase.from('atendimento')
      .select('*').eq('beneficiaria_id', beneficiariaId)
      .order('data_atendimento', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  iniciarSincronizacao() { /* MVP: sem sync offline */ }
}