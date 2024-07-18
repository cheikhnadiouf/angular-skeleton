import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';

import { TodoInterface } from '../todo.interface';
import { TodoState } from './todo.state';
import { TodoStoreService } from './todo-store/todo-store.service';

export function withTodosMethods() {
  return signalStoreFeature(
    { state: type<TodoState>() },
    withMethods((store, todoStoreService = inject(TodoStoreService)) => ({
      loadAllTodos: rxMethod(
        switchMap(() => {
          patchState(store, { loading: true });

          return todoStoreService.getItems().pipe(
            tapResponse({
              next: (allItems) => patchState(store, { items: allItems, success: true, error: false, errorMessage: '' }),
              error: (e: Error) => {
                patchState(store, { error: true, errorMessage: e.message, success: false })
              },
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
      async loadAllTodosByPromise() {
        patchState(store, { loading: true });

        const items = await todoStoreService.getItemsAsPromise();

        patchState(store, { items, loading: false });
      },
      addTodo: rxMethod<TodoInterface>(
        switchMap((value) => {
          patchState(store, { loading: true });

          return todoStoreService.createItem(value).pipe(
            tapResponse({
              next: (item) =>
                patchState(store, { items: [...store.items(), item], success: true, error: false, errorMessage: '' }),
              error: (e: Error) => {
                patchState(store, { error: true, errorMessage: e.message, success: false })
              },
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
      updateTodo: rxMethod<TodoInterface>(
        switchMap((todo) => {
          patchState(store, { loading: true });

          const toSend = { ...todo, done: !todo.done };

          return todoStoreService.updateItem(toSend).pipe(
            tapResponse({
              next: (updatedTodo) => {
                const allItems = [...store.items()];
                const index = allItems.findIndex((x) => x.id === todo.id);

                allItems[index] = updatedTodo;

                patchState(store, {
                  items: allItems,
                  success: true, error: false, errorMessage: ''
                });
              },
              error: (e: Error) => {
                patchState(store, { error: true, errorMessage: e.message, success: false })
              },
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),

      deleteTodo: rxMethod<TodoInterface>(
        switchMap((todo) => {
          patchState(store, { loading: true });

          return todoStoreService.deleteItem(todo).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  items: [...store.items().filter((x) => x.id !== todo.id)],
                  success: true, error: false, errorMessage: ''
                });
              },
              error: (e: Error) => {
                patchState(store, { error: true, errorMessage: e.message, success: false })
              },
              finalize: () => patchState(store, { loading: false }),
            }),
          );
        }),
      ),
    })),
  );
}
