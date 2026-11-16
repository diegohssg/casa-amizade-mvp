import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BeneficiariaService } from '../../beneficiaria.service';
import { AuthService } from '../../auth.service';
import { Beneficiaria } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
  <header class="cabecalho">
    <button class="btn-sair" type="button" (click)="sair()">Sair</button>
    <h1>Casa da Amizade</h1>
    <p>Manhacu Â· Ola, {{ (auth.user$ | async)?.email }}</p>
  </header>
  <main>
    <h2 style="font-size:21px;margin:0 0 12px">Inicio</h2>
    <button class="btn btn-secundario" type="button" (click)="mostrarCadastro = !mostrarCadastro">+ Cadastrar beneficiaria</button>

    <section *ngIf="mostrarCadastro" class="cartao" aria-label="Cadastro de beneficiaria">
      <label for="c-nome">Nome completo *</label>
      <input id="c-nome" [(ngModel)]="novo.nome">
      <label for="c-tel">Telefone *</label>
      <input id="c-tel" [(ngModel)]="novo.telefone" placeholder="(33) 9xxxx-xxxx">
      <label for="c-bairro">Bairro *</label>
      <input id="c-bairro" [(ngModel)]="novo.bairro">
      <label for="c-nasc">Data de nascimento *</label>
      <input id="c-nasc" type="date" [(ngModel)]="novo.data_nascimento">
      <label for="c-sit">Situacao de vulnerabilidade *</label>
      <select id="c-sit" [(ngModel)]="novo.situacao_vulnerabilidade">
        <option value="gestante">Gestante</option>
        <option value="mae_acompanhamento">Mae em acompanhamento</option>
        <option value="outra">Outra</option>
      </select>
      <label for="c-necess">Necessidades identificadas</label>
      <input id="c-necess" [(ngModel)]="novo.necessidades">
      <p class="erro-campo" *ngIf="erroCadastro" role="alert">{{ erroCadastro }}</p>
      <button class="btn btn-primario" type="button" (click)="salvarCadastro()">Salvar cadastro</button>
    </section>

    <h2 style="font-size:21px;margin:22px 0 10px">Localizar beneficiaria</h2>
    <label for="busca">Buscar por nome ou telefone</label>
    <input id="busca" type="search" [formControl]="termo" placeholder="Digite nome ou telefone">
    <button class="btn btn-primario" type="button" (click)="buscar()">Buscar</button>

    <p class="resultado" role="status" *ngIf="buscou && resultados.length">{{ resultados.length }} beneficiaria(s) encontrada(s)</p>
    <p class="resultado" role="status" *ngIf="buscou && !resultados.length">Nenhuma beneficiaria encontrada</p>

    <article class="cartao" *ngFor="let b of resultados">
      <h3 style="font-size:18px;margin:0 0 4px">{{ b.nome }}</h3>
      <p style="color:#425466;margin:0 0 12px">{{ b.bairro }}</p>
      <button class="btn btn-secundario" type="button" [routerLink]="['/historico', b.id]">Ver historico</button>
      <button class="btn btn-primario" type="button" [routerLink]="['/atendimento', b.id]">Registrar atendimento</button>
    </article>
  </main>
  <footer>PROTOTIPO Â· DADOS FICTICIOS Â· Tela 1 de 3</footer>`
})
export class HomeComponent {
  auth = inject(AuthService);
  private service = inject(BeneficiariaService);
  private router = inject(Router);
  termo = new FormControl('');
  resultados: Partial<Beneficiaria>[] = [];
  buscou = false;
  mostrarCadastro = false;
  erroCadastro = '';
  novo = { nome: '', telefone: '', bairro: '', data_nascimento: '', situacao_vulnerabilidade: 'gestante', necessidades: '' };

  async buscar() {
    this.buscou = true;
    this.resultados = await this.service.buscar(this.termo.value ?? '');
  }
  async salvarCadastro() {
    if (!this.novo.nome || !this.novo.telefone || !this.novo.bairro || !this.novo.data_nascimento) {
      this.erroCadastro = 'Preencha nome, telefone, bairro e data de nascimento.';
      return;
    }
    try {
      await this.service.cadastrar(this.novo as never);
      this.mostrarCadastro = false; this.erroCadastro = '';
      this.novo = { nome: '', telefone: '', bairro: '', data_nascimento: '', situacao_vulnerabilidade: 'gestante', necessidades: '' };
      this.buscar();
    } catch { this.erroCadastro = 'Nao foi possivel salvar. Tente novamente.'; }
  }
  async sair() { await this.auth.logout(); this.router.navigate(['/login']); }
}