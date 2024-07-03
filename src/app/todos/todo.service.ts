import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable, throwError } from 'rxjs';
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

  addItem(value: TodoInterface) {
    return this.http.post<TodoInterface>(this.url, value);
  }

  updateItem(value: TodoInterface) {
    return this.http.put<TodoInterface>(`${this.url}/${value.id}`, value);
  }

  deleteItem(value: TodoInterface) {
    return this.http.delete(`${this.url}/${value.id}`);
  }

  errorHandler(error: {
    error: { message: string };
    status: any;
    message: any;
  }) {
    // console.error(error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = error.error?.message || error.message || error;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend error Code: ${status}\nMessage: ${
        error.message
      } | Backend message : ${error.error?.message || error.message || error}`;
    }
    console.debug(errorMessage);
    return throwError(() => errorMessage);
  }
}
