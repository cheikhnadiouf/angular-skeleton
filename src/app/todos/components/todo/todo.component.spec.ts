import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Title } from '@angular/platform-browser';

import { TodoComponent } from './todo.component';
import { NotificationService } from '../../../shared/services/notification.service';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    // Service instancied by the TestBed
    // We can get resolve dependencies using the TestBed injector by using the get function.
    notificationService =  TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});