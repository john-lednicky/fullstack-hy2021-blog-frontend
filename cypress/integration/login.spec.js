describe('Blog app login', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:4000/api/test/seed/all');
    cy.visit('http://localhost:3000');
  });

  it('displays login and blog list to unauthenticated user', function () {
    cy.contains('login');
    cy.contains('blog list');
    cy.contains('The Guerrilla Guide to Interviewing');
    cy.contains('Funky Like a Skunk');
    cy.contains('The Iceberg Secret, Revealed');
    cy.contains('Things You Should Never Do, Part I');
    cy.get('#login-card-header').should('be.visible');
    cy.get('#login-form').should('not.be.visible');
  });

  describe('login', function () {
    it('displays login form when login header is clicked', function () {
      cy.get('#login-card-header').click();
      cy.get('#login-form').should('be.visible');
      cy.get('input#loginUsername').should('be.visible');
      cy.get('input#loginPassword').should('be.visible');
      cy.get('button#loginSubmit').should('be.visible');
    });
    it('displays error toast when login is incorrect', function () {
      cy.get('#login-card-header').click();
      cy.get('input#loginUsername').type('adaldrida.brandybuck');
      cy.get('input#loginPassword').type('wrong-password');
      cy.get('button#loginSubmit').click();
      cy.get('#toast').should('be.visible').contains('o no');
      cy.get('#toast-header').should('have.class', 'bg-danger');
    });
    it('displays success toast and logout button after login succeeds', function () {
      cy.get('#login-card-header').click();
      cy.get('input#loginUsername').type('adaldrida.brandybuck');
      cy.get('input#loginPassword').clear().type('one ring to rule them all');
      cy.get('button#loginSubmit').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('#toast-header').should('have.class', 'bg-success');

      cy.get('#login-form').should('not.exist');
      cy.get('input#loginUsername').should('not.exist');
      cy.get('input#loginPassword').should('not.exist');
      cy.get('button#loginSubmit').should('not.exist');

      cy.get('#logout-button').should('exist').should('have.class', 'bi-box-arrow-right');

    });
  });

});