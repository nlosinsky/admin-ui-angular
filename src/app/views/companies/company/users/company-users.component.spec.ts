import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { CompanyUsersComponent } from '@views/companies/company/users/company-users.component';
import { DxButtonModule } from 'devextreme-angular';

describe('CompanyUsersComponent', () => {
  let component: CompanyUsersComponent;
  let fixture: ComponentFixture<CompanyUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, BgSpinnerModule, DxButtonModule],
      declarations: [CompanyUsersComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
