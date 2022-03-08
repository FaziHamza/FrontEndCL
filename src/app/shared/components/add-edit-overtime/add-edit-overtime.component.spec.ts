import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOvertimeComponent } from './add-edit-overtime.component';

describe('AddEditOvertimeComponent', () => {
  let component: AddEditOvertimeComponent;
  let fixture: ComponentFixture<AddEditOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
