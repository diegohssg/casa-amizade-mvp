import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private _client?: SupabaseClient;
  get client(): SupabaseClient {
    if (!this._client) {
      this._client = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }
    return this._client;
  }
}