import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: '', canActivate: [authGuard], loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'atendimento/:id', canActivate: [authGuard], loadComponent: () => import('./pages/atendimento-form/atendimento-form.component').then(m => m.AtendimentoFormComponent) },
  { path: 'historico/:id', canActivate: [authGuard], loadComponent: () => import('./pages/historico/historico.component').then(m => m.HistoricoComponent) },
  { path: '**', redirectTo: '' }
];