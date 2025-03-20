import { Injectable } from '@angular/core';
import {
  Company,
  CompanyContract,
  CompanyFeatures,
  CompanyMember,
  CompanyUpdateDTO
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

  approvePendingMember(pendingMemberId: string): Observable<unknown> {
    return this.companiesApiService.approvePendingMember(pendingMemberId);
  }

  disapprovePendingMember(pendingMemberId: string): Observable<unknown> {
    return this.companiesApiService.disapprovePendingMember(pendingMemberId);
  }

  getCompany(id: string): Observable<Company> {
    return this.companiesApiService.getCompany(id);
  }

  getPendingMembers(id: string): Observable<CompanyMember[]> {
    return this.companiesApiService.getPendingMembers(id);
  }

  getMembers(id: string): Observable<CompanyMember[]> {
    return this.companiesApiService.getMembers(id);
  }

  getMemberById(memberId: string): Observable<CompanyMember> {
    return this.companiesApiService.getMemberById(memberId);
  }

  updateCompanyMemberAccountState(
    memberId: string,
    accountState: CompanyMemberAccountStateType
  ): Observable<{ accountState: CompanyMemberAccountStateType }> {
    return this.companiesApiService.updateCompanyMemberAccountState(memberId, accountState);
  }

  updateCompanyFeatures(id: string, features: CompanyFeatures): Observable<Company> {
    return this.companiesApiService.updateCompanyFeatures(id, features);
  }

  updateCompanyContract(id: string, contract: CompanyContract): Observable<Company> {
    return this.companiesApiService.updateCompanyContract(id, contract);
  }

  updateCompany(id: string, data: CompanyUpdateDTO): Observable<Company> {
    return this.companiesApiService.updateCompany(id, data);
  }
}
