import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanneComponent } from './scanne.component';

describe('ScanneComponent', () => {
  let component: ScanneComponent;
  let fixture: ComponentFixture<ScanneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScanneComponent]
    });
    fixture = TestBed.createComponent(ScanneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
