import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlComponent } from './add-bl.component';

describe('AddBlComponent', () => {
  let component: AddBlComponent;
  let fixture: ComponentFixture<AddBlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBlComponent]
    });
    fixture = TestBed.createComponent(AddBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
