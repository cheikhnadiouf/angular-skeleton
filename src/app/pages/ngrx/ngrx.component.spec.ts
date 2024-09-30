import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Title } from '@angular/platform-browser';

import { NgrxComponent } from './ngrx.component';
import { NotificationService } from '../../shared/services/notification.service';

describe('NgrxComponent', () => {
  let component: NgrxComponent;
  let fixture: ComponentFixture<NgrxComponent>;
  let titleService: Title;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgrxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgrxComponent);
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
