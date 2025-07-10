import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentsStat } from '@app/shared/models';
import { environment } from '@env/environment';
import { isArray } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class DocumentsApiService {
  private readonly basePath = environment.apiUrl;

  getDocumentsStats(): HttpResourceRef<DocumentsStat[]> {
    return httpResource<DocumentsStat[]>(() => `${this.basePath}/documents`, {
      defaultValue: [],
      parse: (items: unknown) => {
        if (!isArray(items)) {
          return [];
        }
        return items.map(item => new DocumentsStat(item));
      }
    });
  }
}
