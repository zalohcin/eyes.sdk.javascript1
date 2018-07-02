/* globals describe,it,cy,Cypress,context */
describe('eyes.cypress', () => {
  it.skip('runs website', () => {
    cy.visit('http://applitools.com');
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play',
      browser: [{width: 1024, height: 768}, {width: 800, height: 600}],
      showLogs: true,
    });
    cy.eyesCheckWindow('homepage');
    cy.get('.page .navbar a[href="/customers"]').click();
    cy.eyesCheckWindow('customers page');
    cy.get('a[href="/case-studies/walkme"]').click({force: true});
    cy.eyesCheckWindow('walkme page');
    cy.get('.navbar a[href="/pricing"]').click();
    cy.eyesCheckWindow('walkme page');
    cy.eyesClose();
  });

  it.skip('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play-test',
      browser: {width: 1024, height: 768},
      showLogs: true,
    });
    cy.eyesCheckWindow('some tag');
    cy.eyesClose();
  });

  context('Reversim website', () => {
    it('works', () => {
      function verifyCount() {
        cy.get(
          ':nth-child(3) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :nth-child(1)',
        ).then(div => {
          const text = div.text();
          const count = Number(text.replace(/[^\d]/g, ''));
          cy.get('.border-bottom + div > .row').should('have.length', count);
        });
      }

      cy.visit('http://localhost:3000');
      cy.eyesOpen({
        appName: 'reversim website',
        testName: 'works',
        browser: {width: 1200, height: 800},
        showLogs: true,
      });
      cy.eyesCheckWindow('homepage');
      cy.get(':nth-child(1) > .nav-link').click();
      cy.eyesCheckWindow('proposals');
      verifyCount();
      cy.get('.flex-wrap > :nth-child(1)').click();
      cy.eyesCheckWindow('filtered proposals');
      verifyCount();
      cy.eyesClose();
    });
  });
});
