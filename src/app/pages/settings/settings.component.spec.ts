import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { SettingsPageComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPageComponent],
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render settings component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-settings')).toBeTruthy();
  });
});