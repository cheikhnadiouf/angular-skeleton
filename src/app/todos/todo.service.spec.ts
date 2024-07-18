import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Title } from '@angular/platform-browser';

import { TodoService } from './todo.service';


describe('TodoComponent', () => {
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({})
      .compileComponents();
    todoService = TestBed.inject(TodoService);
  });

  it('should create', () => {
    expect(todoService).toBeTruthy();
  });

});