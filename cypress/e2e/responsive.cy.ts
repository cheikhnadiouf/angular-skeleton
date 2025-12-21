describe('Responsive Design Tests', () => {
  const viewports = [
    { device: 'Mobile', width: 375, height: 667 },
    { device: 'Tablet', width: 768, height: 1024 },
    { device: 'Desktop', width: 1920, height: 1080 }
  ]

  viewports.forEach(viewport => {
    describe(`${viewport.device} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
        cy.visit('/')
      })

      it('should display correctly on different screen sizes', () => {
        cy.get('mat-toolbar').should('be.visible')
        cy.contains('Welcome to Angular Skeleton')
      })

      it('should have working navigation', () => {
        if (viewport.width < 768) {
          // Mobile: menu should be hidden initially
          cy.get('mat-sidenav').should('not.be.visible')
          cy.get('button[mat-icon-button]').click()
          cy.get('mat-sidenav').should('be.visible')
        } else {
          // Desktop/Tablet: menu should be visible
          cy.get('mat-sidenav').should('be.visible')
        }
      })

      it('should have accessible todo form', () => {
        cy.get('app-todo').should('be.visible')
        cy.get('input[formControlName="value"]').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
      })
    })
  })
})