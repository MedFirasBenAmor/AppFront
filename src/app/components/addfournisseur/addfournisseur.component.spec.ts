import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfournisseurComponent } from './addfournisseur.component';

describe('AddfournisseurComponent', () => {
  let component: AddfournisseurComponent;
  let fixture: ComponentFixture<AddfournisseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddfournisseurComponent]
    });
    fixture = TestBed.createComponent(AddfournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
