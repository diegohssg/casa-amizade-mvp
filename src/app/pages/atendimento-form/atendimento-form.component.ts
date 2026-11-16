import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BeneficiariaService } from '../../beneficiaria.service';
import { AtendimentoService } from '../../atendimento.service';
import { Beneficiaria, TipoAtendimento } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <header class="cabecalho">
    <button class="btn-sair" type="button" [routerLink]="['/']">Voltar</button>
    <h1>Registrar atendimento</h1>
    <p>Casa da Amizade de Manhacu</p>
  </header>
  <main *ngIf="beneficiaria">
    <div class="cartao">
      <strong>{{ beneficiaria.nome }}</strong><br>
      <span style="color:#425466">{{ beneficiaria.bairro }}</span>
    </div>
    <form [formGroup]="form" (ngSubmit)="salvar()">
      <label for="data">Data do atendimento <span class="obrigatorio" aria-hidden="true">*</span></label>
      <input id="data" type="date" formControlName="data"
        [attr.aria-invalid]="form.controls.data.invalid && form.controls.data.touched" aria-describedby="erro-data">
      <span class="erro-campo" id="erro-data" *ngIf="form.controls.data.invalid && form.controls.data.touched">Informe a data do atendimento.</span>

      <label for="tipo">Tipo de atendimento <span class="obrigatorio" aria-hidden="true">*</span></label>
      <select id="tipo" formControlName="tipo"
        [attr.aria-invalid]="form.controls.tipo.invalid && form.controls.tipo.touched" aria-describedby="erro-tipo">
        <option value="">Selecione...</option>
        <option value="acompanhamento">Acompanhamento</option>
        <option value="acolhimento">Acolhimento / conversa</option>
        <option value="entrega">Entrega de doacao</option>
      </select>
      <span class="erro-campo" id="erro-tipo" *ngIf="form.controls.tipo.invalid && form.controls.tipo.touched">Selecione o tipo de atendimento.</span>

      <label for="obs">Observacao <span class="dica">opcional â€” evite dados sensiveis desnecessarios</span></label>
      <textarea id="obs" formControlName="obs"></textarea>

      <p class="erro-campo" *ngIf="erro" role="alert">{{ erro }}</p>
      <button class="btn btn-primario" type="submit" [disabled]="salvando">{{ salvando ? 'Salvando...' : 'Salvar atendimento' }}</button>
      <button class="btn btn-secundario" type="button" [routerLink]="['/']">Cancelar</button>
    </form>
  </main>
  <footer>PROTOTIPO Â· DADOS FICTICIOS Â· Tela 2 de 3</footer>`
})
export class AtendimentoFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bench = inject(BeneficiariaService);
  private atend = inject(AtendimentoService);
  private fb = inject(FormBuilder);
  beneficiaria: Beneficiaria | null = null;
  salvando = false; erro = '';
  form = this.fb.group({
    data: [new Date().toISOString().slice(0, 10), Validators.required],
    tipo: ['', Validators.required],
    obs: ['']
  });
  async ngOnInit() { this.beneficiaria = await this.bench.obter(this.route.snapshot.paramMap.get('id')!); }
  async salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true; this.erro = '';
    try {
      const r = await this.atend.registrar({
        beneficiaria_id: this.beneficiaria!.id,
        tipo: this.form.value.tipo as TipoAtendimento,
        observacao: this.form.value.obs || undefined,
        data: this.form.value.data + 'T12:00:00'
      });
      if (!r.ok) { this.erro = 'Sem conexao e sem sincronizacao offline no MVP. Verifique a internet e tente novamente.'; return; }
      this.router.navigate(['/historico', this.beneficiaria!.id], { state: { salvo: true, offline: false } });
    } catch {
      this.erro = 'Nao foi possivel confirmar o salvamento. Tente novamente.';
    } finally { this.salvando = false; }
  }
}