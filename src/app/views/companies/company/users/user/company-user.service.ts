import { Injectable, inject } from '@angular/core';
import { CompaniesService } from '@services/data/companies.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyUserService {
  private companiesService = inject(CompaniesService);

  getMemberById(memberId: string | null) {
    return this.companiesService.getMemberById(memberId);
  }
}
