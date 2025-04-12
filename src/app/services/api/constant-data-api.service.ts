import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '@app/shared/models';
import { environment } from '@env/environment';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataApiService {
  private readonly basePath = environment.apiUrl;
  private countries: Country[] = [];

  constructor(private http: HttpClient) {}

  load(): Observable<[Country[]]> {
    return forkJoin([this.loadCountries()]);
  }

  getCountries() {
    return this.countries;
  }

  private loadCountries() {
    return this.http
      .get<Country[]>(`${this.basePath}/constant-data/countries`)
      .pipe(tap((data: Country[]) => (this.countries = data)));
  }
}
