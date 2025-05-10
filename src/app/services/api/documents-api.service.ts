import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DocumentsStat } from '@app/shared/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentsApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;

  getDocumentsStats(): Observable<DocumentsStat[]> {
    return this.http
      .get<DocumentsStat[]>(`${this.basePath}/documents`)
      .pipe(map(items => items.map(item => new DocumentsStat(item))));
  }
}
