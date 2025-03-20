import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Company,
  CompanyContract,
  CompanyFeatures,
  CompanyMember,
  CompanyUpdateDTO,
  User
} from '@app/shared/models';
import {
  CompanyMemberAccountState,
  CompanyMemberAccountStateType,
  CompanyState
} from '@app/shared/models/companies/company.enum';
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

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.basePath}/companies/${id}`).pipe(map(resp => new Company(resp)));
  }

  //  todo
  getPendingMembers(companyId: string, limit = 100, offset = 0): Observable<CompanyMember[]> {
    return this.http
      .get<CompanyMember[]>(`${this.basePath}/members`, {
        params: {
          _limit: limit.toString(),
          _start: offset.toString(),
          companyId,
          accountState: CompanyMemberAccountState.WAIT_APPROVAL
        }
      })
      .pipe(
        map((resp: CompanyMember[]) => {
          return resp.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
        })
      );
  }

  //  todo
  getMembers(companyId: string, limit = 100, offset = 0): Observable<CompanyMember[]> {
    return this.http
      .get<CompanyMember[]>(`${this.basePath}/members`, {
        params: {
          _limit: limit.toString(),
          _start: offset.toString(),
          companyId
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

  updateCompanyFeatures(id: string, features: CompanyFeatures): Observable<Company> {
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, {features});
  }

  updateCompanyContract(id: string, contract: CompanyContract): Observable<Company> {
    console.log(contract);
    return this.http.patch<Company>(`${this.basePath}/companies/${id}`, {contract});
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
