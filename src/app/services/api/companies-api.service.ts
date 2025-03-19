import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Company,
  CompanyContract,
  CompanyFeatures,
  CompanyMember,
  CompanyPendingMember,
  CompanyUpdateDTO,
  User
} from '@app/shared/models';
import { CompanyMemberAccountStateType, CompanyState } from '@app/shared/models/companies/company.enum';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompaniesApiService {
  private readonly basePath = environment.baseAdminUrl;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.getCompaniesByState(CompanyState.ACTIVE)
  }

  getTemporaryCompanies(): Observable<Company[]> {
    return this.getCompaniesByState(CompanyState.PENDING)
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

  //  todo
  approvePendingMember(companyId: string, pendingMemberId: string): Observable<unknown> {
    return this.http.post(`${this.basePath}/companies/${companyId}/pending-members/${pendingMemberId}/approval`, {});
  }

  //  todo
  disapprovePendingMember(companyId: string, pendingMemberId: string): Observable<unknown> {
    return this.http.post(
      `${this.basePath}/companies/${companyId}/pending-members/${pendingMemberId}/disapproval`,
      null
    );
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.basePath}/companies/${id}`).pipe(map(resp => new Company(resp)));
  }

  //  todo
  getPendingMembers(id: string, limit = 100, offset = 0): Observable<CompanyPendingMember[]> {
    return this.http
      .get<CompanyPendingMember[]>(`${this.basePath}/companies/${id}/pending-members`, {
        params: {
          _limit: limit.toString(),
          _start: offset.toString()
        }
      })
      .pipe(
        map((resp: CompanyPendingMember[]) => {
          return resp.map(item => new CompanyPendingMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
        })
      );
  }

  //  todo
  getMembers(id: string, limit = 100, offset = 0): Observable<CompanyMember[]> {
    return this.http
      .get<CompanyMember[]>(`${this.basePath}/companies/${id}/members`, {
        params: {
          _limit: limit.toString(),
          _start: offset.toString()
        }
      })
      .pipe(
        map((resp: CompanyMember[]) => {
          return resp.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
        })
      );
  }

  //  todo
  getMemberById(companyId: string, memberId: string) {
    return this.http
      .get<User>(`${this.basePath}/companies/${companyId}/members/${memberId}`)
      .pipe(map(resp => new User(resp)));
  }

  //  todo
  updateCompanyMemberAccountState(companyId: string, memberId: string, accountState: CompanyMemberAccountStateType) {
    return this.http.put<{ accountState: CompanyMemberAccountStateType }>(
      `${this.basePath}/companies/${companyId}/members/${memberId}/account-state`,
      { accountState }
    );
  }

  //  todo
  updateCompanyFeatures(id: string, features: CompanyFeatures): Observable<CompanyFeatures> {
    return this.http.patch<CompanyFeatures>(`${this.basePath}/companies/${id}/features`, features);
  }

  //  todo
  updateCompanyContract(id: string, contract: CompanyContract): Observable<CompanyContract> {
    return this.http.patch<CompanyContract>(`${this.basePath}/companies/${id}/contract`, contract);
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, data).pipe(map(resp => new Company(resp)));
  }

  private getCompaniesByState(state: CompanyState, limit = 100, offset = 0): Observable<Company[]> {
    return this.http
      .get<Company[]>(`${this.basePath}/companies`, {
        params: {
          _limit: limit.toString(),
          _start: offset.toString(),
          _sort: 'name',
          companyState: state
        }
      })
      .pipe(map(resp => resp.map(item => new Company(item))));
  }
}
