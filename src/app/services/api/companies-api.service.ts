import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Company,
  CompanyContract,
  CompanyFeatures,
  CompanyMember,
  CompanyPendingMember,
  CompanyUpdateDTO,
  TemporaryCompany,
  User
} from '@app/shared/models';
import { CompanyMemberAccountStateType } from '@app/shared/models/companies/company.enum';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompaniesApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  getCompanies(limit = 100, offset = 0): Observable<Company[]> {
    return this.http
      .get<Company[]>(`${this.basePath}/companies`, {
        params: {
          limit: limit.toString(),
          offset: offset.toString()
        }
      })
      .pipe(
        map(resp => {
          return resp.map(item => new Company(item)).sort((a, b) => a.name.localeCompare(b.name));
        })
      );
  }

  getTemporaryCompanies(limit = 100, offset = 0): Observable<TemporaryCompany[]> {
    return this.http
      .get<TemporaryCompany[]>(`${this.basePath}/temporary-companies`, {
        params: {
          limit: limit.toString(),
          offset: offset.toString()
        }
      })
      .pipe(map(resp => resp.map(item => new TemporaryCompany(item))));
  }

  approveTemporaryCompany(id: string): Observable<unknown> {
    return this.http.post(`${this.basePath}/temporary-companies/${id}/approval`, {});
  }

  disapproveTemporaryCompany(id: string): Observable<unknown> {
    return this.http.post(`${this.basePath}/temporary-companies/${id}/disapproval`, null);
  }

  approvePendingMember(companyId: string, pendingMemberId: string): Observable<unknown> {
    return this.http.post(`${this.basePath}/companies/${companyId}/pending-members/${pendingMemberId}/approval`, {});
  }

  disapprovePendingMember(companyId: string, pendingMemberId: string): Observable<unknown> {
    return this.http.post(
      `${this.basePath}/companies/${companyId}/pending-members/${pendingMemberId}/disapproval`,
      null
    );
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.basePath}/companies/${id}`).pipe(map(resp => new Company(resp)));
  }

  getPendingMembers(id: string, limit = 100, offset = 0): Observable<CompanyPendingMember[]> {
    return this.http
      .get<CompanyPendingMember[]>(`${this.basePath}/companies/${id}/pending-members`, {
        params: {
          limit: limit.toString(),
          offset: offset.toString()
        }
      })
      .pipe(
        map((resp: CompanyPendingMember[]) => {
          return resp.map(item => new CompanyPendingMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
        })
      );
  }

  getMembers(id: string, limit = 100, offset = 0): Observable<CompanyMember[]> {
    return this.http
      .get<CompanyMember[]>(`${this.basePath}/companies/${id}/members`, {
        params: {
          limit: limit.toString(),
          offset: offset.toString()
        }
      })
      .pipe(
        map((resp: CompanyMember[]) => {
          return resp.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
        })
      );
  }

  getMemberById(companyId: string, memberId: string) {
    return this.http
      .get<User>(`${this.basePath}/companies/${companyId}/members/${memberId}`)
      .pipe(map(resp => new User(resp)));
  }

  updateCompanyMemberAccountState(companyId: string, memberId: string, accountState: CompanyMemberAccountStateType) {
    return this.http.put<{ accountState: CompanyMemberAccountStateType }>(
      `${this.basePath}/companies/${companyId}/members/${memberId}/account-state`,
      { accountState }
    );
  }

  updateCompanyFeatures(id: string, features: CompanyFeatures): Observable<CompanyFeatures> {
    return this.http.patch<CompanyFeatures>(`${this.basePath}/companies/${id}/features`, features);
  }

  updateCompanyContract(id: string, contract: CompanyContract): Observable<CompanyContract> {
    return this.http.patch<CompanyContract>(`${this.basePath}/companies/${id}/contract`, contract);
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, data).pipe(map(resp => new Company(resp)));
  }
}
