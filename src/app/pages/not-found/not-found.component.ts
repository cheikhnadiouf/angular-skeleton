import { environment } from '../../../environments/environment';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy, AfterViewInit {
  env = environment;
  title = 'Not found page';

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
      this.notificationService.openSnackBar('Page not found !');
    });
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
  }
}
