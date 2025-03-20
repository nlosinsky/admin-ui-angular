import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company, CompanyContract, CompanyFeatures, CompanyMember, CompanyUpdateDTO, User } from '@app/shared/models';
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

  constructor(private http: HttpClient) {
  }

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
    return this.http.get<Company>(`${this.basePath}/companies/${id}`)
      .pipe(map(resp => new Company(resp)));
  }

  getPendingMembers(companyId: string): Observable<CompanyMember[]> {
    return this.getFilteredMembers(companyId, true);
  }

  getMembers(companyId: string): Observable<CompanyMember[]> {
    return this.getFilteredMembers(companyId);
  }

  getMemberById(memberId: string) {
    return this.http
      .get<User>(`${this.basePath}/members/${memberId}`)
      .pipe(map(resp => new CompanyMember(resp)));
  }

  updateCompanyMemberAccountState(memberId: string, accountState: CompanyMemberAccountStateType) {
    return this.http.patch<{ accountState: CompanyMemberAccountStateType }>(
      `${this.basePath}/members/${memberId}`,
      {accountState}
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

  private getFilteredMembers(companyId: string, pending: boolean = false, limit = 100, offset = 0): Observable<CompanyMember[]> {
    const params = {
      _limit: limit.toString(),
      _start: offset.toString(),
      companyId,
      accountState_ne: CompanyMemberAccountState.DECLINED
    }

    if (pending) {
      params['accountState'] = CompanyMemberAccountState.WAIT_APPROVAL;
    } else {
      params['accountState_ne'] = CompanyMemberAccountState.DECLINED;
    }

    return this.http
      .get<CompanyMember[]>(`${this.basePath}/members`, {params})
      .pipe(
        map((resp: CompanyMember[]) => {
          return resp.map(item => new CompanyMember(item))
            .sort((a, b) => a.fullName.localeCompare(b.fullName));
        })
      );
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
