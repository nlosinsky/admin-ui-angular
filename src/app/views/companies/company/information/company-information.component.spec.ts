import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { CompanyInformationComponent } from '@views/companies/company/information/company-information.component';
import { DxValidatorModule } from 'devextreme-angular';

describe('InformationComponent', () => {
  let component: CompanyInformationComponent;
  let fixture: ComponentFixture<CompanyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, BgSpinnerModule, DxValidatorModule],
      declarations: [CompanyInformationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
