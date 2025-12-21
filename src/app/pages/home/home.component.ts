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
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from '../../shared/services/notification.service';
import { I18nService } from '../../shared/services/i18n.service';
import { delay } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  env = environment;
  title = 'Default page';

  private readonly formBuilder = inject(FormBuilder);
  readonly i18nService = inject(I18nService);
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
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    //Called once, when the instance is created.
    this.titleService.setTitle(`${this.title}`);

    setTimeout(() => {
      this.notificationService.openSnackBar('Welcome on Default page!');
    });
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
  }
}
