import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationErrorMessagesComponent } from './validation-error-messages.component';

describe('ValidationErrorMessagesComponent', () => {
  let component: ValidationErrorMessagesComponent;
  let fixture: ComponentFixture<ValidationErrorMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationErrorMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationErrorMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
