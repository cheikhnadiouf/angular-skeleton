import { TodoInterface } from './todo.interface';

export interface TodoState {
  items: TodoInterface[];
  currentItem: Partial<TodoInterface>;
  loading: boolean;
}

export const initialState: TodoState = {
  items: [],
  currentItem: {
    value: '',
    done: false,
  },
  loading: false,
};
