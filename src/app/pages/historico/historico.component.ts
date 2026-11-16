import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BeneficiariaService } from '../../beneficiaria.service';
import { AtendimentoService } from '../../atendimento.service';
import { Atendimento, Beneficiaria } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
  <header class="cabecalho">
    <button class="btn-sair" type="button" [routerLink]="['/']">Voltar</button>
    <h1>Historico</h1>
    <p>{{ beneficiaria?.nome }} Â· {{ beneficiaria?.bairro }}</p>
  </header>
  <main>
    <div class="alerta-sucesso" role="status" *ngIf="salvo">
      <span aria-hidden="true">V</span>
      <span>Atendimento registrado com sucesso</span>
    </div>
    <h2 style="font-size:20px;margin:6px 0 12px">Atendimentos (mais recentes primeiro)</h2>
    <p class="resultado" *ngIf="beneficiaria && !atendimentos.length">Nenhum atendimento registrado ainda.</p>
    <article class="cartao" *ngFor="let a of atendimentos">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <strong>{{ a.data_atendimento | date:'dd/MM/yyyy HH:mm' }}</strong>
        <span class="tag tag-ok">V Registrado</span>
      </div>
      <p style="font-weight:bold;margin:6px 0 2px">{{ a.tipo }}</p>
      <p style="color:#425466;margin:0" *ngIf="a.observacao">{{ a.observacao }}</p>
    </article>
    <div style="margin-top:20px">
      <button class="btn btn-primario" type="button" [routerLink]="['/atendimento', id]">+ Registrar novo atendimento</button>
      <button class="btn btn-secundario" type="button" [routerLink]="['/']">Voltar a busca</button>
    </div>
  </main>
  <footer>PROTOTIPO Â· DADOS FICTICIOS Â· Tela 3 de 3</footer>`
})
export class HistoricoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bench = inject(BeneficiariaService);
  private atend = inject(AtendimentoService);
  id = this.route.snapshot.paramMap.get('id')!;
  beneficiaria: Beneficiaria | null = null;
  atendimentos: Atendimento[] = [];
  salvo = history.state?.salvo ?? false;
  async ngOnInit() {
    this.beneficiaria = await this.bench.obter(this.id);
    this.atendimentos = await this.atend.historico(this.id);
  }
}