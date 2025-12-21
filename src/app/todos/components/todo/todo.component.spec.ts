import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TodoComponent } from './todo.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { TodoService } from '../../services/todo.service';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoComponent],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        Title,
        NotificationService,
        TodoService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    // Service instancied by the TestBed
    // We can get resolve dependencies using the TestBed injector by using the get function.
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
