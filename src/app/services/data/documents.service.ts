import { HttpResourceRef } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DocumentsStat } from '@app/shared/models';
import { DocumentsApiService } from '@services/api/documents-api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private documentsApiService = inject(DocumentsApiService);

  getDocumentsStats(): HttpResourceRef<DocumentsStat[]> {
    return this.documentsApiService.getDocumentsStats();
  }
}
