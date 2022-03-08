import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditJObLeaveComponent } from './add-edit-job-leave.component';

describe('AddEditJObLeaveComponent', () => {
  let component: AddEditJObLeaveComponent;
  let fixture: ComponentFixture<AddEditJObLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditJObLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditJObLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
