import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDailyActivityAddEditComponent } from './timesheet-daily-activity-add-edit.component';

describe('TimesheetDailyActivityAddEditComponent', () => {
  let component: TimesheetDailyActivityAddEditComponent;
  let fixture: ComponentFixture<TimesheetDailyActivityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetDailyActivityAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetDailyActivityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
