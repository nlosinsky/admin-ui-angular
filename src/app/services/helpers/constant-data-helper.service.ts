import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '@app/shared/models';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataHelperService {
  private countries: Country[] = [{ name: 'USA' } as Country];

  constructor(private httpClient: HttpClient) {}

  load(): Observable<[Country[]]> {
    return forkJoin([this.loadCountries()]);
  }

  getCountries() {
    return this.countries;
  }

  private loadCountries() {
    // todo move to server
    // todo execute in the right place on demand
    return of([{ name: 'USA' } as Country]);
    // return this.httpClient
    //   .get<Country[]>('../assets/data/countries.json')
    //   .pipe(tap((data: Country[]) => (this.countries = data)));
  }
}
