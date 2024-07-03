import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../shared/services/notification.service';
import { TodoStore } from '../../todos/store/todo.state';
import { delay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit, OnDestroy, AfterViewInit {
  env = environment;
  title= "Todo widget"
  readonly store = inject(TodoStore);
  private readonly formBuilder = inject(FormBuilder);
  progressBarVal = 0;
  form = this.formBuilder.group({
    inputValue: ['', Validators.required],
    done: [false],
  });

  constructor(
    private titleService: Title,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    //Called once, when the instance is created.
    this.titleService.setTitle(`${ this.title }`);

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome on Home page!');
    });
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
  }

  addTodo() {
    this.store.addTodo(this.form.value.inputValue);
    this.progressBarVal = 100;
    this.form.reset();
    this.notificationService.openSnackBar('Form submitted');
  }
}
