import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials, Token } from '@app/shared/models/auth';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly basePath = environment.baseAuthUrl;

  constructor(private http: HttpClient) {}

  //  todo
  login({ username, password }: LoginCredentials): Observable<Token> {
    const body = new HttpParams().set('grant_type', 'password').set('username', username).set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ` // todo implement
    });

    return this.http.post<Token>(`${this.basePath}/oauth2/token`, body, { headers });
  }
}
