import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinManagementComponent } from './bin-management.component';

describe('BinManagementComponent', () => {
  let component: BinManagementComponent;
  let fixture: ComponentFixture<BinManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinManagementComponent]
    });
    fixture = TestBed.createComponent(BinManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
