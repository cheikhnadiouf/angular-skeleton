import { TodoComponent } from './todo.component'

describe('TodoComponent', () => {
  it('should mount', () => {
    cy.mount(TodoComponent)
  })
})