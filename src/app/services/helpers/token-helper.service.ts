import { Injectable } from '@angular/core';
import { StorageHelperService } from '@services/helpers/storage-helper.service';

@Injectable({
  providedIn: 'root'
})
export class TokenHelperService {
  constructor(private storage: StorageHelperService) {}

  get accessToken(): string {
    const data = this.storage.getTokenData();
    return data?.accessToken || '';
  }

  get isTokenValid(): boolean {
    return !!(this.accessToken || '').length;
  }
}
