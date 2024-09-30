import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, lastValueFrom, Observable, retry, throwError } from 'rxjs';
import { TodoInterface } from '../models/todo.interface';
import { environment } from '../../../environments/environment';
import { initialState, TodoState } from '../models/todo.state';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  env = environment;
  private url = `${this.env.apiURL}/todos`;

  getItems(): Observable<TodoInterface[]> {
    const params = new HttpParams();
    //.set('orderBy', '"$key"')
    //.set('limitToFirst', "1");
    console.debug('trigger fetching');
    return this.http.get<TodoInterface[]>(this.url, { params });
  }

  getItemsAsPromise(): Promise<TodoInterface[]> {
    return lastValueFrom(this.http.get<TodoInterface[]>(this.url));
  }

  getItem(id: string): Observable<TodoInterface> {
    return this.http.get<TodoInterface>(`${this.url}/${id}`);
  }

  createItem(value: TodoInterface): Observable<TodoInterface> {
    return this.http.post<TodoInterface>(this.url, value);
  }

  updateItem(value: TodoInterface): Observable<TodoInterface> {
    return this.http.put<TodoInterface>(`${this.url}/${value.id}`, value);
  }

  deleteItem(value: TodoInterface): Observable<TodoInterface> {
    return this.http.delete<TodoInterface>(`${this.url}/${value.id}`);
  }

  handleError(err: HttpErrorResponse): string {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${
        err.message
      }`;
    }
    console.error(errorMessage);
    // return throwError(() => errorMessage);
    return errorMessage;
  }
}
