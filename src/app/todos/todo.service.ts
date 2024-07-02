import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { TodoInterface } from './todo.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  env = environment;
  private url = `${this.env.apiURL}/todos`;

  getItems(): Observable<TodoInterface[]> {
    return this.http.get<TodoInterface[]>(this.url);
  }

  getItemsAsPromise() {
    return lastValueFrom(this.http.get<TodoInterface[]>(this.url));
  }

  getItem(id: string) {
    return this.http.get<TodoInterface>(`${this.url}/${id}`);
  }

  addItem(value: string) {
    return this.http.post<TodoInterface>(this.url, { value });
  }

  updateItem(value: TodoInterface) {
    return this.http.put<TodoInterface>(`${this.url}/${value.id}`, value);
  }

  deleteItem(value: TodoInterface) {
    return this.http.delete(`${this.url}/${value.id}`);
  }
}
