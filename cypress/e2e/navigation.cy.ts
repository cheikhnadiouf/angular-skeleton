describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate to home page', () => {
    cy.get('button[mat-icon-button]').click()
    cy.contains('Home').click()
    cy.url().should('include', '/pages/home')
    cy.contains('Welcome to Angular Skeleton')
  })

  it('should navigate to settings page', () => {
    cy.get('button[mat-icon-button]').click()
    cy.contains('Settings').click()
    cy.url().should('include', '/pages/settings')
    cy.contains('Language Selection')
  })

  it('should navigate to not found page', () => {
    cy.visit('/pages/invalid-route')
    cy.url().should('include', '/pages/notfound')
  })

  it('should display mobile menu on small screens', () => {
    cy.viewport(375, 667) // Mobile viewport
    cy.get('button[mat-icon-button]').should('be.visible')
    cy.get('button[mat-icon-button]').click()
    cy.get('mat-sidenav').should('be.visible')
  })
})