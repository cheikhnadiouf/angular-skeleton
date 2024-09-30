import { environment } from '../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../shared/services/notification.service';
import { TodoStore } from '../../todos/store/todo.state';
import { delay } from 'rxjs';

@Component({
  selector: 'app-ngrx',
  templateUrl: './ngrx.component.html',
  styleUrls: ['./ngrx.component.scss'],
})
export class NgrxComponent implements OnInit, OnDestroy, AfterViewInit {
  env = environment;
  title = 'Ngrx page';
  readonly store = inject(TodoStore);
  private readonly formBuilder = inject(FormBuilder);
  progressBarVal = 0;
  form = this.formBuilder.group({
    value: ['', Validators.required],
    done: [false],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    //Called once, when the instance is created.
    this.titleService.setTitle(`${this.title}`);

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome on Ngrx page!');
    });
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
  }
}
