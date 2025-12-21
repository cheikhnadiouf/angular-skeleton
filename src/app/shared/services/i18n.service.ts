import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export interface Language {
  code: string;
  name: string;
  flag: string;
  fontFamily: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  currentLanguage = signal<string>('en');
  
  readonly supportedLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', fontFamily: 'Roboto' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', fontFamily: 'Roboto' },
    { code: 'es', name: 'Español', flag: '🇪🇸', fontFamily: 'Roboto' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', fontFamily: 'Roboto' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', fontFamily: 'Roboto' },
    { code: 'pt', name: 'Português', flag: '🇵🇹', fontFamily: 'Roboto' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', fontFamily: 'Noto Sans Arabic' },
    { code: 'zh', name: '中文', flag: '🇨🇳', fontFamily: 'Noto Sans SC' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', fontFamily: 'Noto Sans JP' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', fontFamily: 'Noto Sans KR' }
  ];

  private http = inject(HttpClient);

  constructor(private translate: TranslateService) {
    this.loadTranslationsFromFiles();
    this.initializeLanguage();
  }

  private loadTranslationsFromFiles(): void {
    this.supportedLanguages.forEach(lang => {
      this.http.get(`./assets/i18n/${lang.code}.json`).subscribe(translations => {
        this.translate.setTranslation(lang.code, translations as any);
      });
    });
  }

  private initializeLanguage(): void {
    this.translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(langCode: string): void {
    if (this.supportedLanguages.find(lang => lang.code === langCode)) {
      this.translate.use(langCode);
      this.currentLanguage.set(langCode);
      localStorage.setItem('selectedLanguage', langCode);
      this.updateDocumentDirection(langCode);
      this.updateFontFamily(langCode);

    }
  }

  private updateDocumentDirection(langCode: string): void {
    const isRTL = langCode === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  }

  private updateFontFamily(langCode: string): void {
    const language = this.supportedLanguages.find(lang => lang.code === langCode);
    if (language) {
      document.documentElement.style.setProperty('--primary-font', language.fontFamily);
    }
  }

  getCurrentLanguage(): Language | undefined {
    return this.supportedLanguages.find(lang => lang.code === this.currentLanguage());
  }
}