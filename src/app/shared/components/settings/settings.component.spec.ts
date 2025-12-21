import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { SettingsComponent } from './settings.component';
import { I18nService } from '../../services/i18n.service';
import { SharedModule } from '../../shared.module';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let i18nService: I18nService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [I18nService]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    i18nService = TestBed.inject(I18nService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have i18nService injected', () => {
    expect(component.i18nService).toBeDefined();
  });

  it('should change language when onLanguageChange is called', () => {
    const spy = jest.spyOn(i18nService, 'setLanguage');
    component.onLanguageChange('fr');
    expect(spy).toHaveBeenCalledWith('fr');
  });

  it('should display supported languages', () => {
    expect(component.i18nService.supportedLanguages.length).toBe(10);
  });
});