import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomsComponent } from './meeting-rooms.component';

describe('MeetingRoomsComponent', () => {
  let component: MeetingRoomsComponent;
  let fixture: ComponentFixture<MeetingRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
