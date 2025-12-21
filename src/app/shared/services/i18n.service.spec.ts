import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [I18nService, TranslateService]
    });
    service = TestBed.inject(I18nService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have supported languages', () => {
    expect(service.supportedLanguages).toBeDefined();
    expect(service.supportedLanguages.length).toBe(10);
  });

  it('should set language correctly', () => {
    service.setLanguage('fr');
    expect(service.currentLanguage()).toBe('fr');
  });

  it('should get current language', () => {
    service.setLanguage('es');
    const currentLang = service.getCurrentLanguage();
    expect(currentLang?.code).toBe('es');
    expect(currentLang?.name).toBe('Español');
  });

  it('should update document direction for RTL languages', () => {
    service.setLanguage('ar');
    expect(document.documentElement.dir).toBe('rtl');
    
    service.setLanguage('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('should persist language selection', () => {
    service.setLanguage('de');
    expect(localStorage.getItem('selectedLanguage')).toBe('de');
  });
});