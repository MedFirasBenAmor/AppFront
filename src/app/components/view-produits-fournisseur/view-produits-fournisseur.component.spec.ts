import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProduitsFournisseurComponent } from './view-produits-fournisseur.component';

describe('ViewProduitsFournisseurComponent', () => {
  let component: ViewProduitsFournisseurComponent;
  let fixture: ComponentFixture<ViewProduitsFournisseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProduitsFournisseurComponent]
    });
    fixture = TestBed.createComponent(ViewProduitsFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
