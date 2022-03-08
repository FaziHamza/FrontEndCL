import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditJobDayComponent } from './add-edit-job-day.component';

describe('AddEditJobDayComponent', () => {
  let component: AddEditJobDayComponent;
  let fixture: ComponentFixture<AddEditJobDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditJobDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditJobDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
