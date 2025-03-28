import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentsStat } from '@app/shared/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentsApiService {
  private readonly basePath = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDocumentsStats(): Observable<DocumentsStat[]> {
    return this.http
      .get<DocumentsStat[]>(`${this.basePath}/documents`)
      .pipe(map(items => items.map(item => new DocumentsStat(item))));
  }
}
