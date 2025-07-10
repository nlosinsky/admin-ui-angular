import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '@app/shared/models';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataApiService {
  private readonly basePath = environment.apiUrl;

  countriesResource = httpResource<Country[]>(() => `${this.basePath}/constant-data/countries`, { defaultValue: [] });
}
