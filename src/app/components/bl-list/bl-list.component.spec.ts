import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlListComponent } from './bl-list.component';

describe('BlListComponent', () => {
  let component: BlListComponent;
  let fixture: ComponentFixture<BlListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlListComponent]
    });
    fixture = TestBed.createComponent(BlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
