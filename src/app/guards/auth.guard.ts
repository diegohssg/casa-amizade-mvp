import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SupabaseService } from '../supabase.service';

export const authGuard: CanActivateFn = async () => {
  if (environment.demo) return true;
  const { data } = await inject(SupabaseService).client.auth.getSession();
  return data.session ? true : inject(Router).createUrlTree(['/login']);
};