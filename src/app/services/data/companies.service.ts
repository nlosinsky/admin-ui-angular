import { Injectable, inject, Signal } from '@angular/core';
import { Company, CompanyContract, CompanyFeatures, CompanyUpdateDTO } from '@app/shared/models';
import { CompanyMemberAccountStateType } from '@app/shared/models/companies/company.enum';
import { CompaniesApiService } from '@services/api/companies-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private companiesApiService = inject(CompaniesApiService);

  getCompanies() {
    return this.companiesApiService.getCompanies();
  }

  getTemporaryCompanies() {
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

  getCompany(id: Signal<string | null>) {
    return this.companiesApiService.getCompany(id);
  }

  getPendingMembers(id: Signal<string | null>) {
    return this.companiesApiService.getPendingMembers(id);
  }

  getMembers(id: Signal<string | null>) {
    return this.companiesApiService.getMembers(id);
  }

  getMemberById(memberId: string | null) {
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
