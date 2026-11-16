import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService).client;
  readonly user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    if (environment.demo) {
      this.user$.next({ id: 'demo-user', email: 'voluntaria@exemplo.com' } as User);
      return;
    }
    this.supabase.auth.getSession().then(({ data }) => this.user$.next(data.session?.user ?? null));
    this.supabase.auth.onAuthStateChange((_e, s) => this.user$.next(s?.user ?? null));
  }
  async login(email: string, senha: string) {
    if (environment.demo) { this.user$.next({ id: 'demo-user', email } as User); return; }
    const { error } = await this.supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw new Error('E-mail ou senha invalidos');
  }
  async logout() {
    if (environment.demo) { this.user$.next(null); return; }
    await this.supabase.auth.signOut();
  }
  get userId(): string { return this.user$.value?.id ?? ''; }
}