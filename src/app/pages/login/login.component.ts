import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <header class="cabecalho"><h1>Casa da Amizade</h1><p>Manhacu Â· Gestao de beneficiarias</p></header>
  <main>
    <h2 style="font-size:21px;margin:0 0 6px">Entrar</h2>
    <p class="dica" *ngIf="demo">Modo demonstracao: qualquer e-mail e senha (min. 4 caracteres) entram.</p>
    <form [formGroup]="form" (ngSubmit)="entrar()">
      <label for="email">E-mail</label>
      <input id="email" type="email" formControlName="email" autocomplete="username">
      <label for="senha">Senha</label>
      <input id="senha" type="password" formControlName="senha" autocomplete="current-password">
      <p class="erro-campo" *ngIf="erro" role="alert">{{ erro }}</p>
      <button class="btn btn-primario" type="submit" [disabled]="form.invalid || carregando">
        {{ carregando ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </main>
  <footer>PROTOTIPO Â· v0.3</footer>`
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  demo = environment.demo;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(this.demo ? 4 : 12)]]
  });
  erro = ''; carregando = false;
  async entrar() {
    if (this.form.invalid) return;
    this.carregando = true; this.erro = '';
    try {
      await this.auth.login(this.form.value.email!, this.form.value.senha!);
      this.router.navigate(['/']);
    } catch { this.erro = 'E-mail ou senha invalidos'; }
    finally { this.carregando = false; }
  }
}