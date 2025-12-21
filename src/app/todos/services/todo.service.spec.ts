import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    }).compileComponents();
    todoService = TestBed.inject(TodoService);
  });

  it('should create', () => {
    expect(todoService).toBeTruthy();
  });
});
