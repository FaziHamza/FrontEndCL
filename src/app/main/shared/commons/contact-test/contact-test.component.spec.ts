import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTestComponent } from './contact-test.component';

describe('ContactTestComponent', () => {
  let component: ContactTestComponent;
  let fixture: ComponentFixture<ContactTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
