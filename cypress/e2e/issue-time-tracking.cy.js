

describe('Time tracking', () => {
    beforeEach(() => {

        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            cy.get('[data-testid="modal:issue-create"]').within(() => {
                cy.get('[data-testid="select:type"]').click();
                cy.get('[data-testid="select-option:Bug"]')
                    .trigger('click');
                cy.get('.ql-editor').type('My bug description');
                cy.get('input[name="title"]').type('Bug');
                cy.get('[data-testid="select:userIds"]').click();
                cy.get('[data-testid="select-option:Pickle Rick"]').click();
                cy.get('button[type="submit"]').click();
            });
            cy.get('[data-testid="modal:issue-create"]').should('not.exist');
            cy.contains('Issue has been successfully created.').should('be.visible');
            cy.reload();
            cy.contains('Issue has been successfully created.').should('not.exist');
            cy.get('[data-testid="list-issue"]').contains('Bug').click();
        });
    });

    it('Time estimation tests', () => {

        const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
        const estimationValue = 10;
        const newEstimationValue = 20

        //add estimation
        getIssueDetailsModal().within(() => {
            cy.get('div').contains('No time logged')
                .should('exist');
            cy.get('input[placeholder="Number"]')
                .click()
                .type(estimationValue)
                .wait(3000)
            cy.get('[data-testid="icon:close"]').first().click();
        });
        cy.reload();
        cy.contains('Bug').click();
        cy.get('input[placeholder="Number"]').should('have.value', `${estimationValue}`);
        cy.get('[data-testid="icon:close"]').first().click();

        //'Update estimation test'
        cy.get('[data-testid="list-issue"]').first().click()
        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]')
                .click()
                .clear()
                .type(newEstimationValue)
                .wait(3000)
            cy.get('[data-testid="icon:close"]').first().click();
        });
        cy.reload();
        cy.get('[data-testid="list-issue"]').first().click();
        cy.get('input[placeholder="Number"]').should('have.value', `${newEstimationValue}`);
        cy.get('[data-testid="icon:close"]').first().click();

        //remove estimation
        cy.get('[data-testid="list-issue"]').first().click()
        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]')
                .click()
                .clear()
                .wait(3000)
            cy.get('[data-testid="icon:close"]').first().click();
        });
        cy.reload();
        cy.get('[data-testid="list-issue"]').first().click();
        cy.get('input[placeholder="Number"]').should('have.value', '');
        cy.get('[data-testid="icon:close"]').first().click();
    });


    
    it('Time Logging tests', () => {

        const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
        const estimationValue = 10;

        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]')
                .click()
                .type(estimationValue)
                .wait(3000)

            //log time test    
            cy.get('[data-testid="icon:stopwatch"]').click()
            cy.wait(3000)
        })
        cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]').first()
                .click()
                .type('2')
                .wait(3000)
            cy.get('input[placeholder="Number"]').last()
                .click()
                .type('5')
            cy.get('div').contains('Done').click()
        })
        getIssueDetailsModal().within(() => {
            cy.get('div').contains('2h logged').should('be.visible');
            cy.get('div').contains('5h remaining').should('be.visible');
            cy.get('div').contains('No time logged').should('not.exist')

            //remove logged time test
            cy.get('[data-testid="icon:stopwatch"]').click()
        });
        cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]').first()
                .click()
                .clear()
                .wait(3000)
            cy.get('input[placeholder="Number"]').last()
                .click()
                .clear()
            cy.get('div').contains('Done').click()
        })
        getIssueDetailsModal().within(() => {
            cy.get('div').contains('2h logged').should('not.exist');
            cy.get('div').contains('5h remaining').should('not.exist');
            cy.get('div').contains('No time logged').should('exist').should('be.visible')
        });
    })
})
