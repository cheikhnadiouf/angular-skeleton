import { Component, OnInit, OnDestroy, AfterViewInit, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValueChangeEvent } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../../shared/services/notification.service';
import { TodoStore } from '../../../todos/store/todo.state';
import { delay, filter } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TodoInterface } from '../../todo.interface';
import { getState, patchState } from '@ngrx/signals';

@Component({
  selector: 'app-todo-store',
  templateUrl: './todo-store.component.html',
  styleUrl: './todo-store.component.css'
})
export class TodoStoreComponent implements OnInit, OnDestroy, AfterViewInit {
  env = environment;
  title = "Todo widget"
  readonly store = inject(TodoStore);

  progressBarVal = 0;
  todoForm!: FormGroup;

  constructor(
    private titleService: Title,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    this.todoForm = this.formBuilder.group({
      value: new FormControl<string | null>(this.store.currentTodo.value(), [Validators.required]),
      done: new FormControl<boolean>(this.store.currentTodo.done(), []),
    });

    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.
      const state = getState(this.store);
      console.log('Todo state changed', state);
      if (state.error) {
        this.notificationService.openSnackBar(`Error: ${ state.errorMessage }`, 'red-snackbar');
        this.todoForm.get('value').setErrors({ serverError: true });
      } 

      if (state.success) {
        this.notificationService.openSnackBar(`Success: Form input: ${this.todoForm.value.value} | Current Todo state: ${this.store.currentTodo.value()}`, 'green-snackbar');
        this.todoForm.get('value').reset();
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
      this.notificationService.openSnackBar('Welcome on Todo store page!', 'green-snackbar');
    });
    
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

          // To synchronize form update with signal store
          patchState(this.store, {
            currentTodo: event.value,
            error: false,
            errorMessage: '',
            success: false
          });
          console.log(event);
        },
      });
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
  }

  addTodo() {
    this.store.addTodo(this.todoForm.value as unknown as TodoInterface); // 'as unknown' is used for any Partial interface types
  }
}
