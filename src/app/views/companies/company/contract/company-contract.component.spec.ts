import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { CompanyContractComponent } from '@views/companies/company/contract/company-contract.component';

describe('CompanyContractComponent', () => {
  let component: CompanyContractComponent;
  let fixture: ComponentFixture<CompanyContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, BgSpinnerModule],
      declarations: [CompanyContractComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
