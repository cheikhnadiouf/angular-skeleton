import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValueChangeEvent } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../shared/services/notification.service';
import { TodoStore } from '../../todos/store/todo.state';
import { delay, filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TodoInterface } from '../todo.interface';
import { patchState } from '@ngrx/signals';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit, OnDestroy, AfterViewInit {
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
  }

  ngOnInit(): void {
    //Called once, when the instance is created.
    this.titleService.setTitle(`${this.title}`);

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome on Home page!');
    });

    // To synchronize form update with signal store
    this.todoForm.events
      .pipe(filter((event) => event instanceof ValueChangeEvent)) // ValueChangeEvent | StatusChangeEvent | PristineChangeEvent | TouchedChangeEvent 
      .subscribe({
        next: (event: ValueChangeEvent<unknown>) => {
          patchState(this.store, {
            currentTodo: event.value,
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
    // this.form.reset();
    this.notificationService.openSnackBar(`Form submitted: ${this.todoForm.value.value} | Current Todo state: ${this.store.currentTodo.value()}`);
  }
}
