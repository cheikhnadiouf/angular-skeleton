import { signalStore, withHooks, withState } from '@ngrx/signals';
import { TodoInterface } from '../todo.interface';
import { withTodosMethods } from './todo.methods';
import { withTodosSelectors } from './todo.selectors';

export interface TodoState {
  items: TodoInterface[];
  loading: boolean;
}

export const initialState: TodoState = {
  items: [],
  loading: false,
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState<TodoState>(initialState),
  withTodosSelectors(),
  withTodosMethods(),
  withHooks({
    onInit({ loadAllTodosByPromise }) {
      console.log('on init');
      loadAllTodosByPromise();
    },
    onDestroy() {
      console.log('on destroy');
    },
  }),
);
