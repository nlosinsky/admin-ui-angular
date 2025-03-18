import { Injectable } from '@angular/core';
import { StorageHelperService } from '@services/helpers/storage-helper.service';
import { isPast } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class TokenHelperService {
  constructor(private storage: StorageHelperService) {}

  get accessToken(): string {
    const data = this.storage.getTokenData();
    return data?.access_token || '';
  }

  get isTokenExpired(): boolean {
    const data = this.storage.getTokenData();
    if (data && data.accessTokenExpiresAt) {
      return isPast(new Date(data.accessTokenExpiresAt));
    }
    throw new Error('Token not available to perform expiration check.');
  }

  get isTokenValid(): boolean {
    return !!(this.accessToken || '').length && !this.isTokenExpired;
  }
}
