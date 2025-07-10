import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Company, CompanyContract, CompanyFeatures, CompanyMember, CompanyUpdateDTO } from '@app/shared/models';
import {
  CompanyMemberAccountState,
  CompanyMemberAccountStateType,
  CompanyState
} from '@app/shared/models/companies/company.enum';
import { environment } from '@env/environment';
import { isArray } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompaniesApiService {
  private http = inject(HttpClient);

  private readonly basePath = environment.apiUrl;

  getCompanies() {
    return this.getCompaniesByState(CompanyState.ACTIVE);
  }

  getTemporaryCompanies() {
    return this.getCompaniesByState(CompanyState.PENDING);
  }

  approveTemporaryCompany(id: string): Observable<unknown> {
    return this.http.patch(`${this.basePath}/companies/${id}`, {
      companyState: CompanyState.ACTIVE
    });
  }

  disapproveTemporaryCompany(id: string): Observable<unknown> {
    return this.http.patch(`${this.basePath}/companies/${id}`, {
      companyState: CompanyState.ARCHIVED
    });
  }

  getCompany(companyId: Signal<string | null>): HttpResourceRef<Company | null> {
    return httpResource(
      // @ts-ignore
      () => {
        return companyId() ? `${this.basePath}/companies/${companyId()}` : undefined;
      },
      {
        defaultValue: null,
        parse: (value: unknown) => new Company(value)
      }
    );
  }

  approvePendingMember(pendingMemberId: string): Observable<unknown> {
    return this.http.patch(`${this.basePath}/members/${pendingMemberId}`, {
      accountState: CompanyMemberAccountState.APPROVED
    });
  }

  disapprovePendingMember(pendingMemberId: string): Observable<unknown> {
    return this.http.patch(`${this.basePath}/members/${pendingMemberId}`, {
      accountState: CompanyMemberAccountState.DECLINED
    });
  }

  getPendingMembers(companyId: Signal<string | null>, limit = 100, offset = 0): HttpResourceRef<CompanyMember[]> {
    return httpResource(
      () => {
        const id = companyId();
        return id
          ? {
              url: `${this.basePath}/members/pending`,
              params: {
                limit,
                offset,
                companyId: id
              }
            }
          : undefined;
      },
      {
        defaultValue: [],
        parse: (value: unknown) => {
          return Array.isArray(value)
            ? value.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName))
            : [];
        }
      }
    );
  }

  getMembers(companyId: Signal<string | null>, limit = 100, offset = 0): HttpResourceRef<CompanyMember[]> {
    return httpResource(
      () => {
        const id = companyId();
        return id
          ? {
              url: `${this.basePath}/members/approved`,
              params: {
                limit,
                offset,
                companyId: id
              }
            }
          : undefined;
      },
      {
        defaultValue: [],
        parse: (value: unknown) => {
          return Array.isArray(value)
            ? value.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName))
            : [];
        }
      }
    );
  }

  getMemberById(memberId: string | null) {
    return httpResource(
      () => {
        return memberId ? { url: `${this.basePath}/members/${memberId}` } : undefined;
      },
      {
        parse: (value: unknown): CompanyMember => new CompanyMember(value)
      }
    );
  }

  updateCompanyMemberAccountState(memberId: string, accountState: CompanyMemberAccountStateType) {
    return this.http.patch<{ accountState: CompanyMemberAccountStateType }>(`${this.basePath}/members/${memberId}`, {
      accountState
    });
  }

  updateCompanyFeatures(id: string, features: CompanyFeatures): Observable<Company> {
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, { features });
  }

  updateCompanyContract(id: string, contract: CompanyContract): Observable<Company> {
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, { contract });
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, data).pipe(map(resp => new Company(resp)));
  }

  private getCompaniesByState(state: CompanyState, limit = 100, offset = 0) {
    return httpResource(
      () => ({
        url: `${this.basePath}/companies`,
        params: {
          limit,
          offset,
          companyState: state
        }
      }),
      {
        defaultValue: [],
        parse: (value: unknown) => {
          return isArray(value) ? value.map(item => new Company(item)) : [];
        }
      }
    );
  }
}
