import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BgSpinnerModule } from '@components/bg-spinner/bg-spinner.component';
import { CompanyFinanceComponent } from '@views/companies/company/finance/company-finance.component';

describe('CompanyFinanceComponent', () => {
  let component: CompanyFinanceComponent;
  let fixture: ComponentFixture<CompanyFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BgSpinnerModule],
      declarations: [CompanyFinanceComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
