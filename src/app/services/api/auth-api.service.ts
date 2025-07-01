import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginCredentials, Token } from '@app/shared/models/auth';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;

  login(credentials: LoginCredentials): Observable<Token> {
    return this.http.post<Token>(`${this.basePath}/auth/login`, credentials);
  }
}
