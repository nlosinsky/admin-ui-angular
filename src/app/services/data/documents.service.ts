import { Injectable, inject } from '@angular/core';
import { DocumentsStat } from '@app/shared/models';
import { DocumentsApiService } from '@services/api/documents-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private documentsApiService = inject(DocumentsApiService);

  getDocumentsStats(): Observable<DocumentsStat[]> {
    return this.documentsApiService.getDocumentsStats();
  }
}
