import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService, Language } from '../../services/i18n.service';

@Component({
    selector: 'app-settings',
    template: `
    <mat-card class="settings-card">
      <mat-card-header>
        <mat-card-title>{{ 'SETTINGS.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="language-section">
          <h3>{{ 'SETTINGS.LANGUAGE_SELECTION' | translate }}</h3>
          <p>{{ 'SETTINGS.SELECT_LANGUAGE' | translate }}</p>
          
          <mat-form-field appearance="outline" class="language-select">
            <mat-label>{{ 'COMMON.LANGUAGE' | translate }}</mat-label>
            <mat-select 
              [value]="i18nService.currentLanguage()" 
              (selectionChange)="onLanguageChange($event.value)">
              <mat-option 
                *ngFor="let lang of i18nService.supportedLanguages" 
                [value]="lang.code">
                {{ lang.flag }} {{ lang.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .settings-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    .language-section {
      margin: 20px 0;
    }
    
    .language-select {
      width: 100%;
      margin-top: 16px;
    }
    
    mat-option {
      font-family: var(--primary-font, 'Roboto');
    }
  `],
    standalone: false
})
export class SettingsComponent {
  i18nService = inject(I18nService);

  onLanguageChange(langCode: string): void {
    this.i18nService.setLanguage(langCode);
  }
}