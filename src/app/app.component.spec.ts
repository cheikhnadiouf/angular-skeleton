import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { expect } from '@jest/globals';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerService } from './shared/services/spinner.service';
import { I18nService } from './shared/services/i18n.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let media: MediaMatcher;
  let spinnerService: SpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        SharedModule.forRoot(),
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        MediaMatcher,
        SpinnerService,
        I18nService,
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // Service instancied by the TestBed
    // We can get resolve dependencies using the TestBed injector by using the get function.
    media = TestBed.inject(MediaMatcher);
    spinnerService = TestBed.inject(SpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Angular 18+ skeleton');
  });

  it('should initialize mobile query', () => {
    expect(component.mobileQuery).toBeDefined();
  });

  it('should have i18nService', () => {
    expect(component.i18nService).toBeDefined();
  });
});
