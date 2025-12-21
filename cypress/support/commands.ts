// Custom Cypress commands for the Angular Skeleton app

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Navigate to a specific page
       */
      navigateToPage(page: string): Chainable<void>
      
      /**
       * Change language using the header menu
       */
      changeLanguage(language: string): Chainable<void>
      
      /**
       * Create a new todo item
       */
      createTodo(todoText: string): Chainable<void>
      
      /**
       * Wait for Angular to be ready
       */
      waitForAngular(): Chainable<void>
    }
  }
}

Cypress.Commands.add('navigateToPage', (page: string) => {
  cy.get('button[mat-icon-button]').click()
  cy.contains(page).click()
})

Cypress.Commands.add('changeLanguage', (language: string) => {
  cy.get('[data-cy="language-menu"]').click()
  cy.contains(language).click()
})

Cypress.Commands.add('createTodo', (todoText: string) => {
  cy.get('input[formControlName="value"]').type(todoText)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('waitForAngular', () => {
  cy.window().its('ng').should('exist')
})

export {}