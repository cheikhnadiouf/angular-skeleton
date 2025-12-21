import { browser, by, element } from 'protractor';

export class HomePage {
  navigateTo() {
    return browser.get('/pages/home');
  }

  getTitleText() {
    return element(by.css('mat-card-title')).getText();
  }

  getWelcomeText() {
    return element(by.css('h2')).getText();
  }

  getDescriptionText() {
    return element(by.css('p')).getText();
  }

  getLanguageInfo() {
    return element(by.css('.language-info p')).getText();
  }

  getTodoComponent() {
    return element(by.css('app-todo'));
  }

  isHomeIconVisible() {
    return element(by.css('mat-icon[fontIcon="home"]')).isPresent();
  }
}

describe('Home Page E2E Tests', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should display home page elements', () => {
    page.navigateTo();
    expect(page.getTitleText()).toContain('Home');
    expect(page.getWelcomeText()).toContain('Welcome to Angular Skeleton');
    expect(page.isHomeIconVisible()).toBeTruthy();
  });

  it('should display language information', () => {
    page.navigateTo();
    expect(page.getLanguageInfo()).toContain('Language:');
  });

  it('should display todo component', () => {
    page.navigateTo();
    expect(page.getTodoComponent().isPresent()).toBeTruthy();
  });
});