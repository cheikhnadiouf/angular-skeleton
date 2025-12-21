import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HomeComponent } from './home.component';
import { NotificationService } from '../../shared/services/notification.service';
import { I18nService } from '../../shared/services/i18n.service';
import { SharedModule } from '../../shared/shared.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let titleService: Title;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        SharedModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        Title,
        NotificationService,
        I18nService,
        TranslateService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    // Service instancied by the TestBed
    // We can get resolve dependencies using the TestBed injector by using the get function.
    titleService = TestBed.inject(Title);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should have I18nService injected', () => {
    expect(component.i18nService).toBeDefined();
  });

  it('should set page title on init', () => {
    component.ngOnInit();
    expect(titleService.getTitle()).toContain(component.title);
  });
});
