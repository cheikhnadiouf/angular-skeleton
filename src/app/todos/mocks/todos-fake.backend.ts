import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import todosMock from './todos.json';


// array in local storage for todos
const todosKey = 'todos-mock';
const todosJSON = localStorage.getItem(todosKey);
let todos: any[] = todosJSON
  ? JSON.parse(todosJSON)
  : todosMock;

@Injectable({
  providedIn: 'root',
})
export class TodosBackendLessInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/todos') && method === 'GET':
          return getTodos();
        case url.match(/\/todos\/\w+$/) && method === 'GET':
          return getTodoById();
        case url.endsWith('/todos') && method === 'POST':
          return createTodo();
        case url.match(/\/todos\/\w+$/) && method === 'PATCH':
          return updateTodo();
        case url.match(/\/todos\/\w+$/) && method === 'PUT':
            return updateTodo();
        case url.match(/\/todos\/\w+$/) && method === 'DELETE':
          return deleteTodo();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getTodos() {
      // return ok(todos.map(x => basicDetails(x)));
      const todosMockNew = todos.map((x) => basicDetails(x));
      return ok(todosMockNew);
    }

    function getTodoById() {
      const todo = todos.find((x) => x.id === idFromUrl());
      if (!todo) {
        return error(`Todo with the id ${idFromUrl()} do not exist`);
      }
      return ok(basicDetails(todo));
    }

    function createTodo() {
      const todo = typeof body === 'string'? JSON.parse(body) : body;

      // Check if already exist
      if (todos.find((x) => x.value === todo.value)) {
        return error(`Todo with the value ${todo.value} already exists`);
      }

      // assign todo id and a few other properties then save
      todo.id = newTodoId();
      todos.push(todo);
      localStorage.setItem(todosKey, JSON.stringify(todos));

      return ok(basicDetails(todo));
    }

    function updateTodo() {
      let params = typeof body === 'string' ? JSON.parse(body) : body;
      let todo = todos.find((x) => x.id === idFromUrl());

      if (
        params.value !== todo.value &&
        todos.find((x) => x.value === params.value)
      ) {
        return error(`Todo with the value ${params.value} already exists`);
      }

      // only update password if entered
      if (!params.password) {
        delete params.password;
      }

      // update and save todo
      Object.assign(todo, params);
      localStorage.setItem(todosKey, JSON.stringify(todos));

      return ok(basicDetails(todo));
    }

    function deleteTodo() {
      const todo = todos.find((x) => x.id === idFromUrl());
      if (!todo) {
        return error(`Todo with the id ${idFromUrl()} do not exist`);
      }
      todos = todos.filter((x) => x.id !== idFromUrl());
      localStorage.setItem(todosKey, JSON.stringify(todos));
      return ok(basicDetails(todo));
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: any, statusCode: number = 500) {
      console.error(message);
      return throwError(() => { return { status: statusCode, message: message } }).pipe(
        materialize(),
        delay(500),
        dematerialize(),
      ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function basicDetails(todo: any) {
      const { id, value, done, active } = todo;
      return { id, value, done, active };
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }

    function newTodoId() {
      let myuuid = uuidv4();
      // base64 encoding
      myuuid = btoa(myuuid);

      // return todos.length ? Math.max(...todos.map(x => x.id)) + 1 : 1;
      return myuuid;
    }
  }
}
