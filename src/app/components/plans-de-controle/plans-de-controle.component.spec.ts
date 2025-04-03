import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansDeControleComponent } from './plans-de-controle.component';

describe('PlansDeControleComponent', () => {
  let component: PlansDeControleComponent;
  let fixture: ComponentFixture<PlansDeControleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlansDeControleComponent]
    });
    fixture = TestBed.createComponent(PlansDeControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
