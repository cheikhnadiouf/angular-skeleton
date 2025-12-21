import { browser, by, element } from 'protractor';

export class NotFoundPage {
  navigateTo() {
    return browser.get('/pages/notfound');
  }

  navigateToInvalidRoute() {
    return browser.get('/invalid-route');
  }

  getTitleText() {
    return element(by.css('mat-card-title')).getText();
  }

  getErrorMessage() {
    return element(by.css('mat-card-content p')).getText();
  }

  isErrorIconVisible() {
    return element(by.css('mat-icon')).isPresent();
  }

  getCurrentUrl() {
    return browser.getCurrentUrl();
  }
}

describe('Not Found Page E2E Tests', () => {
  let page: NotFoundPage;

  beforeEach(() => {
    page = new NotFoundPage();
  });

  it('should display not found page when navigating to invalid route', () => {
    page.navigateToInvalidRoute();
    expect(page.getCurrentUrl()).toContain('/pages/notfound');
  });

  it('should display not found page elements', () => {
    page.navigateTo();
    expect(page.getTitleText()).toContain('Not Found');
    expect(page.isErrorIconVisible()).toBeTruthy();
  });

  it('should display error message', () => {
    page.navigateTo();
    expect(page.getErrorMessage()).toContain('page');
  });
});