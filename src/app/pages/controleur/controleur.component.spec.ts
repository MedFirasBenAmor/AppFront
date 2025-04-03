import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleurComponent } from './controleur.component';

describe('ControleurComponent', () => {
  let component: ControleurComponent;
  let fixture: ComponentFixture<ControleurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControleurComponent]
    });
    fixture = TestBed.createComponent(ControleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
