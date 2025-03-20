import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '@app/shared/models';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataHelperService {
  private countries: Country[] = [];

  constructor(private httpClient: HttpClient) {}

  load(): Observable<[Country[]]> {
    return forkJoin([this.loadCountries()]);
  }

  getCountries() {
    return this.countries;
  }

  private loadCountries() {
    return this.httpClient
      .get<Country[]>('/assets/constant-data/countries.json')
      .pipe(tap((data: Country[]) => (this.countries = data)));
  }
}
