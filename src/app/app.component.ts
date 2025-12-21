import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { SpinnerService } from './shared/services/spinner.service';
import { I18nService } from './shared/services/i18n.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  showSpinner: boolean = false;
  title: string = 'Angular 18+ skeleton';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public spinnerService: SpinnerService,
    private translate: TranslateService,
    public i18nService: I18nService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    //Called once, when the instance is created.
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    // Force change detection after translation setup
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 100);
  }

  ngAfterViewInit(): void {
    //Called when view initialized.
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
