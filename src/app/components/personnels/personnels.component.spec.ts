import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelsComponent } from './personnels.component';

describe('PersonnelsComponent', () => {
  let component: PersonnelsComponent;
  let fixture: ComponentFixture<PersonnelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelsComponent]
    });
    fixture = TestBed.createComponent(PersonnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
