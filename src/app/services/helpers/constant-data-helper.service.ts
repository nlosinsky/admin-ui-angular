import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, ProductsOfInterest } from '@app/shared/models';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConstantDataHelperService {
  private productsOfInterests: ProductsOfInterest[] = [];
  private countries: Country[] = [];

  constructor(private httpClient: HttpClient) {}

  load(): Observable<[ProductsOfInterest[], Country[]]> {
    return forkJoin([this.loadProductOfInterest(), this.loadCountries()]);
  }

  getProductOfInterest() {
    return this.productsOfInterests;
  }

  getCountries() {
    return this.countries;
  }

  private loadProductOfInterest() {
    return this.httpClient.get<ProductsOfInterest[]>('/assets/constant-data/products-of-interest.json').pipe(
      map(data => data.sort((a, b) => (a.name || '').localeCompare(b.name))),
      tap((data: ProductsOfInterest[]) => (this.productsOfInterests = data))
    );
  }

  private loadCountries() {
    return this.httpClient
      .get<Country[]>('/assets/constant-data/countries.json')
      .pipe(tap((data: Country[]) => (this.countries = data)));
  }
}
