import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, lastValueFrom, Observable, retry, throwError } from 'rxjs';
import { TodoInterface } from './todo.interface';
import { environment } from '../../environments/environment';


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

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  env = environment;
  private url = `${this.env.apiURL}/todos`;
  // manage states with signals
  todosSignal = signal<Partial<TodoState>>(null); // set null initial value

  constructor(){
    this.todosSignal.set(initialState);
  }
  
  getItems() {
    // return this.http.get<TodoInterface[]>(this.url);
    const params = new HttpParams()
        //.set('orderBy', '"$key"')
        //.set('limitToFirst', "1");
    console.debug('trigger fetching');
    this.http
      .get<any>(this.url, {params})
      .pipe(
        retry(3),
        catchError((error) => {
          return this.handleError(error);
          // console.error('Error fetching :', error);
          // return of(1);
        })
      )
      .subscribe((data) => {
        // subscribe to a signal to receive updates.
        console.debug('API Response:', data);
        this.todosSignal.set({ items: data, loading: false});
        console.debug('set todosSignal', this.todosSignal());
      });      
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

  
  handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
        }`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
