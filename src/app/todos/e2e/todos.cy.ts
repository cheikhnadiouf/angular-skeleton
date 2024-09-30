describe('Todos page test', () => {
  beforeEach(() => {
    cy.visit('/pages/home');
  });

  // Action buttons
  it('it should exist add button', () => {
    cy.get('#add').should('exist');
  });

  // Query
  it('should query items', () => {
    cy.get('.mat-mdc-snack-bar-label').should('exist');
    cy.contains('Data fetching success');
  });

  // Create
  it('should create a new item', () => {
    cy.get('#value').type('Test item');
    cy.get('#add').click();
    cy.get('.mat-mdc-snack-bar-label').should('exist');
    cy.contains('Data create success');
  });

  // Read
  it('should read an item', () => {
    cy.get('mat-checkbox').last().click();
    cy.get('mat-checkbox').last().should('have.value', 'Test item');
  });

  // Update
  it('should update an item', () => {
    cy.get('mat-checkbox').last().click();
    cy.get('mat-checkbox').last().should('have.value', 'Test item');
    cy.get('.mat-mdc-snack-bar-label').should('exist');
    cy.contains('Data update success');
  });

  // Delete
  it('should delete an item', () => {
    cy.get('button').last().click();
    // cy.on('window:confirm', () => true);
    cy.get('.mat-mdc-snack-bar-label').should('exist');
    cy.contains('Data delete success');
  });
});
