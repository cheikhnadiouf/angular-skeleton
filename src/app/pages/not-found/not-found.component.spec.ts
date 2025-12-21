import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NotFoundComponent } from './not-found.component';
import { NotificationService } from '../../shared/services/notification.service';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let titleService: Title;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        Title,
        NotificationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
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
});
