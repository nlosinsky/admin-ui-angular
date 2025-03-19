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
import { CompanyMemberAccountStateType } from '@app/shared/models/companies/company.enum';
import { CompaniesApiService } from '@services/api/companies-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  constructor(private companiesApiService: CompaniesApiService) {}

  getCompanies(): Observable<Company[]> {
    return this.companiesApiService.getCompanies();
  }

  getTemporaryCompanies(): Observable<Company[]> {
    return this.companiesApiService.getTemporaryCompanies();
  }

  approveTemporaryCompany(id: string): Observable<unknown> {
    return this.companiesApiService.approveTemporaryCompany(id);
  }

  disapproveTemporaryCompany(id: string): Observable<unknown> {
    return this.companiesApiService.disapproveTemporaryCompany(id);
  }

  approvePendingMember(companyId: string, pendingMemberId: string): Observable<unknown> {
    return this.companiesApiService.approvePendingMember(companyId, pendingMemberId);
  }

  disapprovePendingMember(companyId: string, pendingMemberId: string): Observable<unknown> {
    return this.companiesApiService.disapprovePendingMember(companyId, pendingMemberId);
  }

  getCompany(id: string): Observable<Company> {
    return this.companiesApiService.getCompany(id);
  }

  getPendingMembers(id: string): Observable<CompanyPendingMember[]> {
    return this.companiesApiService.getPendingMembers(id);
  }

  getMembers(id: string): Observable<CompanyMember[]> {
    return this.companiesApiService.getMembers(id);
  }

  getMemberById(companyId: string, memberId: string): Observable<User> {
    return this.companiesApiService.getMemberById(companyId, memberId);
  }

  updateCompanyMemberAccountState(
    companyId: string,
    memberId: string,
    accountState: CompanyMemberAccountStateType
  ): Observable<{ accountState: CompanyMemberAccountStateType }> {
    return this.companiesApiService.updateCompanyMemberAccountState(companyId, memberId, accountState);
  }

  updateCompanyFeatures(id: string, features: CompanyFeatures): Observable<CompanyFeatures> {
    return this.companiesApiService.updateCompanyFeatures(id, features);
  }

  updateCompanyContract(id: string, contract: CompanyContract): Observable<CompanyContract> {
    return this.companiesApiService.updateCompanyContract(id, contract);
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.companiesApiService.updateCompany(id, data);
  }
}
