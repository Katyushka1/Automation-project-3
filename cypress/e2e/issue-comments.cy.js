describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    it('Should create, edit and delete a comment successfully', () => {
        const comment = 'TEST_COMMENT';
        const comment1 = 'TEST_COMMENT_EDITED';
        const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

        getIssueDetailsModal().within(() => {

            //create a comment
            cy.contains('Add a comment...')
                .click();
            cy.get('textarea[placeholder="Add a comment..."]').type(comment);
            cy.contains('button', 'Save')
                .click()
                .should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);

            //edit comment
            cy.get('[data-testid="issue-comment"]')
                .contains('Edit')
                .click()
                .should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', comment)
                .clear()
                .type(comment1);
            cy.contains('button', 'Save')
                .click()
                .should('not.exist');
            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment1);
        });
            //delete comment
            getIssueDetailsModal()
                .find('[data-testid="issue-comment"]')
                .contains('Delete')
                .click();
             cy.get('[data-testid="modal:confirm"]')
                .contains('button', 'Delete comment')
                .click()
                .should('not.exist');
            getIssueDetailsModal()
                .find('[data-testid="issue-comment"]')
                .contains(comment)
                .should('not.exist');
    })
});
