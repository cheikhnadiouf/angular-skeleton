describe('Settings Page Tests', () => {
  beforeEach(() => {
    cy.visit('/pages/settings')
  })

  it('should display settings page', () => {
    cy.contains('Settings')
    cy.contains('Language Selection')
  })

  it('should display language dropdown', () => {
    cy.get('mat-select').should('be.visible')
  })

  it('should change language', () => {
    cy.get('mat-select').click()
    cy.get('mat-option').contains('Français').click()
    cy.contains('Paramètres') // French for Settings
  })

  it('should display current language in header', () => {
    cy.get('[data-cy="language-menu"]').should('contain', '🇺🇸')
  })

  it('should change language from header menu', () => {
    cy.get('[data-cy="language-menu"]').click()
    cy.contains('🇫🇷 Français').click()
    cy.contains('Paramètres')
  })
})