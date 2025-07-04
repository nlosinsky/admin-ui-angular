import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Country } from '@app/shared/models';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;
  private countries: Country[] = [];

  getCountries(): Observable<Country[]> {
    if (this.countries.length) {
      return of(this.countries);
    }

    return this.http
      .get<Country[]>(`${this.basePath}/constant-data/countries`)
      .pipe(tap((data: Country[]) => (this.countries = data)));
  }
}
