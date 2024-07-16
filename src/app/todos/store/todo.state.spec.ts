import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { provideMock } from '../../../../testing/auto-mock';
import { TodoInterface } from '../todo.interface';
import { TodoStoreService } from './todo-store/todo-store.service';
import { TodoStore } from './todo.state';

describe('TodoStore', () => {
  let service: TodoStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoStore, provideMock(TodoStoreService)],
    });

    service = TestBed.inject(TodoStoreService);
  });

  describe('with Methods', () => {
    it('should update store when item is moved to done', waitForAsync(() => {
      // arrange
      const store = TestBed.inject(TodoStore);
      const item = { id: '1', value: 'test', done: false } as TodoInterface;
      jest.spyOn(service, 'updateItem').mockReturnValue(of(item));
      const spy = jest.spyOn(store, 'updateTodo');

      // act
      store.updateTodo(item);

      // assert
      expect(spy).toHaveBeenCalledWith({ ...item, done: true });
    }));
  });
});
