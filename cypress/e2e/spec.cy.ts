describe('Home page Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Home page')
  })
})
