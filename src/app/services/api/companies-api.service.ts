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
  private readonly basePath = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.getCompaniesByState(CompanyState.ACTIVE);
  }

  getTemporaryCompanies(): Observable<Company[]> {
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

  getPendingMembers(companyId: string, limit = 100, offset = 0): Observable<CompanyMember[]> {
    const params = {
      companyId,
      limit,
      offset
    };

    return this.http.get<CompanyMember[]>(`${this.basePath}/members/pending`, { params }).pipe(
      map((resp: CompanyMember[]) => {
        return resp.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
      })
    );
  }

  getMembers(companyId: string, limit = 100, offset = 0): Observable<CompanyMember[]> {
    const params = {
      companyId,
      limit,
      offset
    };

    return this.http.get<CompanyMember[]>(`${this.basePath}/members/approved`, { params }).pipe(
      map((resp: CompanyMember[]) => {
        return resp.map(item => new CompanyMember(item)).sort((a, b) => a.fullName.localeCompare(b.fullName));
      })
    );
  }

  getMemberById(memberId: string) {
    return this.http.get<User>(`${this.basePath}/members/${memberId}`).pipe(map(resp => new CompanyMember(resp)));
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

  private getCompaniesByState(state: CompanyState, limit = 100, offset = 0): Observable<Company[]> {
    return this.http
      .get<Company[]>(`${this.basePath}/companies`, {
        params: {
          limit,
          offset,
          companyState: state
        }
      })
      .pipe(map(resp => resp.map(item => new Company(item))));
  }
}
