describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the home page with correct title', () => {
    cy.contains('Welcome to Angular Skeleton')
    cy.contains('Home')
  })

  it('should display language information', () => {
    cy.contains('Language:')
    cy.contains('English')
  })

  it('should have navigation menu', () => {
    cy.get('mat-toolbar').should('be.visible')
    cy.get('button[mat-icon-button]').should('be.visible')
  })

  it('should display todo component', () => {
    cy.get('app-todo').should('be.visible')
  })

  it('should navigate to settings page', () => {
    cy.get('[data-cy="user-menu"]').click()
    cy.contains('Settings').click()
    cy.url().should('include', '/pages/settings')
  })
})