describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
      cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    });
  });

  it('Test Case 1: Issue Deletion', () => {

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    getIssueDetailsModal().within(() => {
    cy.get('[data-testid="icon:trash"]').click();
    })
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Delete issue").click();
    });
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="board-list:backlog"]').should('be.visible');
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');
    cy.reload();
    cy.contains('This is an issue of type: Task.').should('not.exist');
  });

  it('Test Case 2: Issue Deletion Cancellation', () => {

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    })
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Cancel").click();
    })
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:close"]').first().click();
    });
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.reload();
    cy.get('[data-testid="board-list:backlog"]').should('be.visible');
    cy.contains('This is an issue of type: Task.').should('be.visible');
  });
})