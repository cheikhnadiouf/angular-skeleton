describe('Todo Component Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display todo component', () => {
    cy.get('app-todo').should('be.visible')
    cy.contains('Task')
  })

  it('should create a new todo', () => {
    cy.get('input[formControlName="value"]').type('Test todo item')
    cy.get('button[type="submit"]').click()
    cy.contains('Data create success')
  })

  it('should display todo list', () => {
    cy.get('mat-list').should('be.visible')
  })

  it('should show progress bar when loading', () => {
    cy.get('mat-progress-bar').should('be.visible')
  })

  it('should display todo statistics', () => {
    cy.contains('% done')
  })

  it('should handle form validation', () => {
    cy.get('button[type="submit"]').click()
    cy.get('input[formControlName="value"]').should('have.class', 'ng-invalid')
  })

  it('should toggle todo completion', () => {
    // First create a todo
    cy.get('input[formControlName="value"]').type('Test todo for toggle')
    cy.get('button[type="submit"]').click()
    
    // Then toggle it
    cy.get('mat-checkbox').first().click()
    cy.contains('Data update success')
  })

  it('should delete a todo', () => {
    // First create a todo
    cy.get('input[formControlName="value"]').type('Test todo for deletion')
    cy.get('button[type="submit"]').click()
    
    // Then delete it
    cy.get('button[mat-mini-fab]').first().click()
    cy.contains('Data delete success')
  })
})