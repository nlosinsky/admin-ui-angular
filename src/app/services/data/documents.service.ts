import { Injectable } from '@angular/core';
import { DocumentsStat } from '@app/shared/models';
import { DocumentsApiService } from '@services/api/documents-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  constructor(private documentsApiService: DocumentsApiService) {}

  getDocumentsStats(): Observable<DocumentsStat[]> {
    return this.documentsApiService.getDocumentsStats();
  }
}
