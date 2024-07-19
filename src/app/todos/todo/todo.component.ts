import { Component, OnInit, OnDestroy, AfterViewInit, inject, effect, signal, computed } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValueChangeEvent } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../shared/services/notification.service';
import { TodoStore } from '../../todos/store/todo.state';
import { catchError, delay, filter, of, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TodoInterface } from '../todo.interface';
import { initialState, TodoState } from '../todo.state';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit, OnDestroy, AfterViewInit {
  env = environment;
  title = "Todo widget";
  errorMessage = "";
  progressBarVal = 0;
  todoForm!: FormGroup;

  // manage states with signals
  todosSignal = signal<Partial<TodoState>>(null); // set null initial value

  todoState = this.todosSignal()
  doneCount = computed(() => this.todosSignal().items.filter((x) => x.done).length);
  undoneCount = computed(() => this.todosSignal().items.filter((x) => !x.done).length);
  percentageDone = computed(() => {
    const done = this.todosSignal().items.filter((x) => x.done).length;
    const total = this.todosSignal().items.length;

    if (total === 0) {
      return 0;
    }

    return (done / total) * 100;
  });
  lastTodo = computed(() => {
    const total = this.todosSignal().items.length;
    const lastItem = (total > 0) ? this.todosSignal().items[total - 1] : { value: '' };
    return lastItem;
  });



  constructor(
    private titleService: Title,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private todoService: TodoService
  ) {
    // Initialize Signal values
    this.todosSignal.set(initialState);

    // Initialize form input values
    this.todoForm = this.formBuilder.group({
      value: new FormControl<string | null>(this.todosSignal().currentItem.value, [Validators.required]),
      done: new FormControl<boolean>(this.todosSignal().currentItem.done, []),
    });

    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.

      const itemsLength: number = this.todosSignal().items.length;
      console.debug('Todo state changed', this.todosSignal());
      if (itemsLength == 0) {
        this.notificationService.openSnackBar(`Empty data`, 'red-snackbar');
      }

    },
      // Writing to signals is not allowed in a `computed` or an `effect` by default. 
      // Using `allowSignalWrites` in the `CreateEffectOptions` to enable this inside effects from input form binding with signals
      { allowSignalWrites: true });
  }

  ngOnInit(): void {
    //Called once, when the instance is created.
    this.titleService.setTitle(`${this.title}`);

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome on Todo page!', 'green-snackbar');
    });

    // Data fetching
    this.queryTodos();

    // Handle Unified Control State Change Events 
    this.todoForm.events
      .pipe(filter((event) => event instanceof ValueChangeEvent)) // ValueChangeEvent | StatusChangeEvent | PristineChangeEvent | TouchedChangeEvent 
      .subscribe({
        next: (event: ValueChangeEvent<unknown>) => {
          this.todoForm.get('value').setErrors(null);
          // this.todoForm.get('value').reset();
          // this.todoForm.get('value').setValue('Done');
          // this.todoForm.get('value').markAsPristine();
          // this.todoForm.get('value').markAsTouched();
          // this.todoForm.get('value').setErrors({ incorrect: true });

          // To synchronize form update with signal state          
          this.todosSignal.set({
            ...this.todosSignal(),
            currentItem: event.value
          });
          console.debug("State Change Event: ", event);
        },
      });
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
  }

  // Troubleshoot for angular material checkbox event
  handleInputCheckbox(event: Event, item) {
    const input = event?.target as HTMLInputElement;
    // console.debug(input?.checked);
    const updatedTodo: Partial<TodoInterface> = {
      // id: Date.now().toString(),
      ...item,
      done: input?.checked
    };
    this.todosSignal.set({ ...this.todosSignal(), currentItem: updatedTodo });
    this.updateTodo(updatedTodo as TodoInterface);
  }

  queryTodos() {
    this.todosSignal.set({ ...this.todosSignal(), loading: true });
    this.todoService.getItems()
      .pipe(retry(3))
      .subscribe({
        next: (data) => {
          // subscribe to a signal to receive updates.
          console.debug('Data fetching:', data);
          this.todosSignal.set({ ...this.todosSignal(), items: data, loading: false });
          console.debug('set todosSignal', this.todosSignal());
          this.errorMessage = '';
          this.todoForm.get('value').setErrors(null);
          this.notificationService.openSnackBar('Data fetching success', 'green-snackbar');
        },
        error: (error) => {
          this.todosSignal.set({ ...this.todosSignal(), loading: false });
          this.errorMessage = this.todoService.handleError(error);
          this.notificationService.openSnackBar(`Error: ${this.errorMessage}`, 'red-snackbar');
          this.todoForm.get('value').setErrors({ serverError: true });
          console.error('Error fetching :', error);
          // return of([]);
        },
        complete: () => console.debug('Request complete')
      });
  }

  createTodo() {
    this.todosSignal.set({ ...this.todosSignal(), loading: true });
    const newTodo: Partial<TodoInterface> = {
      // id: Date.now().toString(),
      value: this.todoForm.get('value').value,
      done: this.todoForm.get('done').value
    };
    this.todoService.createItem(newTodo as TodoInterface)
      .pipe(retry(2))
      .subscribe(
        {
          next: (data: TodoInterface) => {
            // subscribe to a signal to receive updates.
            console.debug('Data fetching:', data);
            // Add new data item only
            let items: TodoInterface[] = this.todosSignal().items;
            items.push(data);
            this.todosSignal.set({ ...this.todosSignal(), items: items, loading: false });
            // Or update all items
            // this.queryTodos()

            console.debug('set todosSignal', this.todosSignal());
            this.errorMessage = '';
            this.todoForm.get('value').setErrors(null);
            this.notificationService.openSnackBar('Data update success', 'green-snackbar');
          },
          error: (error) => {
            this.todosSignal.set({ ...this.todosSignal(), loading: false });
            this.errorMessage = this.todoService.handleError(error);
            this.notificationService.openSnackBar(`Error: ${this.errorMessage}`, 'red-snackbar');
            this.todoForm.get('value').setErrors({ serverError: true });
            console.error('Error fetching :', error);
            return of(null);
          },
          complete: () => console.debug('Request complete')
        }
      );
  }

  updateTodo(todo: TodoInterface) {
    this.todosSignal.set({ ...this.todosSignal(), loading: true });
    this.todoService.updateItem(todo)
      .pipe(
        retry(2)
      )
      .subscribe(
        {
          next: (data: TodoInterface) => {
            // subscribe to a signal to receive updates.
            console.debug('Data fetching:', data);
            // Update data item only
            const index = this.todosSignal().items.findIndex((todo) => todo.id === data.id);
            if (index !== -1) {
              let items: TodoInterface[] = this.todosSignal().items;
              items[index] = data;
              this.todosSignal.set({ ...this.todosSignal(), items: items, loading: false });
            }
            // Or update all items
            // this.queryTodos()

            console.debug('set todosSignal', this.todosSignal());
            this.errorMessage = '';
            this.todoForm.get('value').setErrors(null);
            this.notificationService.openSnackBar('Data update success', 'green-snackbar');
          },
          error: (error) => {
            this.todosSignal.set({ ...this.todosSignal(), loading: false });
            this.errorMessage = this.todoService.handleError(error);
            this.notificationService.openSnackBar(`Error: ${this.errorMessage}`, 'red-snackbar');
            this.todoForm.get('value').setErrors({ serverError: true });
            console.error('Error fetching :', error);
            return of(null);
          },
          complete: () => console.debug('Request complete')
        });
  }

  deleteTodo(todo: TodoInterface) {
    this.todosSignal.set({ ...this.todosSignal(), loading: true });
    this.todoService.deleteItem(todo)
      .pipe(retry(2))
      .subscribe(
        {
          next: (data: TodoInterface) => {
            // subscribe to a signal to receive updates.
            console.debug('Data fetching:', data);
            // Update data item only
            const index = this.todosSignal().items.findIndex((todo) => todo.id === data.id);
            if (index !== -1) {
              let items: TodoInterface[] = this.todosSignal().items;
              items = items.filter((item) => item.id !== data.id)
              this.todosSignal.set({ ...this.todosSignal(), items: items, loading: false });
            }
            // Or update all items
            // this.queryTodos()

            console.debug('set todosSignal', this.todosSignal());
            this.errorMessage = '';
            this.todoForm.get('value').setErrors(null);
            this.notificationService.openSnackBar('Data update success', 'green-snackbar');
          },
          error: (error) => {
            this.todosSignal.set({ ...this.todosSignal(), loading: false });
            this.errorMessage = this.todoService.handleError(error);
            this.notificationService.openSnackBar(`Error: ${this.errorMessage}`, 'red-snackbar');
            this.todoForm.get('value').setErrors({ serverError: true });
            console.error('Error fetching :', error);
            return of(null);
          },
          complete: () => console.debug('Request complete')
        });
  }
}
