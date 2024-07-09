import { signalStore, withHooks, withState } from '@ngrx/signals';
import { TodoInterface } from '../todo.interface';
import { withTodosMethods } from './todo.methods';
import { withTodosSelectors } from './todo.selectors';

export interface TodoState {
  items: TodoInterface[];
  currentTodo: Partial<TodoInterface>,
  loading: boolean;
}

export const initialState: TodoState = {
  items: [],
  currentTodo: {
    value: '',
    done: false
  },
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
      // or loadAllTodos();
    },
    onDestroy() {
      console.log('on destroy');
    },
  }),
);
