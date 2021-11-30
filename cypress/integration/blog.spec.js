describe('Blog app blogs', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:4000/api/test/seed/all');
    cy.visit('http://localhost:3000');
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.get('#login-card-header').click();
      cy.get('#login-form').should('be.visible');
      cy.get('input#loginUsername').type('adaldrida.brandybuck');
      cy.get('input#loginPassword').clear().type('one ring to rule them all');
      cy.get('button#loginSubmit').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('#logout-button').should('exist').should('have.class', 'bi-box-arrow-right');
    });

    it('allows the user to create a blog', function () {
      cy.get('#blog-form-header').click();
      cy.get('#blog-author').type('Bootsy Collins');
      cy.get('#blog-title').type('Bootsy Collins on What James Brown Taught Him, Why He Quit Drugs');
      cy.get('#blog-url').type('https://www.rollingstone.com/music/music-features/bootsy-collins-on-what-james-brown-taught-him-why-he-quit-drugs-204108/');
      cy.get('#blog-form-submit').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('#login-form').should('not.exist');
      cy.contains('Bootsy Collins on What James Brown Taught Him');
    });

    it('allows the user to like a blog', function () {
      cy.get('#blog-form-header').click();
      cy.get('#blog-author').type('Bootsy Collins');
      cy.get('#blog-title').type('Bootsy Collins on What James Brown Taught Him, Why He Quit Drugs');
      cy.get('#blog-url').type('https://www.rollingstone.com/music/music-features/bootsy-collins-on-what-james-brown-taught-him-why-he-quit-drugs-204108/');
      cy.get('#blog-form-submit').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('#login-form').should('not.exist');
      cy.contains('Bootsy Collins on What James Brown Taught Him')
        .click();

      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(1)');
      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(2)');
      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(3)');
    });

    it('allows the user to delete their own blog', function () {
      cy.get('#blog-form-header').click();
      cy.get('#blog-author').type('Bootsy Collins');
      cy.get('#blog-title').type('Bootsy Collins on What James Brown Taught Him, Why He Quit Drugs');
      cy.get('#blog-url').type('https://www.rollingstone.com/music/music-features/bootsy-collins-on-what-james-brown-taught-him-why-he-quit-drugs-204108/');
      cy.get('#blog-form-submit').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('#login-form').should('not.exist');
      cy.contains('Bootsy Collins on What James Brown Taught Him').click();

      cy.get('.blog-like-count').contains('(0)');
      cy.contains('delete blog').click();
      cy.get('#confirm-delete-blog').contains('Confirm').click();
      cy.get('#toast').should('be.visible').contains('yay');

      cy.contains('Bootsy Collins on What James Brown Taught Him').should('not.exist');

    });

    // eslint-disable-next-line quotes
    it("does not allow the user to delete someone else's blog", function () {
      cy.contains('Funky Like a Skunk').click();
      cy.get('.blog-like-count').contains('(5)');
      cy.get('delete blog').should('not.exist');
    });

    it('sorts blogs by likes', function () {
      cy.get('.blog-likes').should('have.length', 4);

      /* How to check alphabet sorting with cypress */
      /* https://stackoverflow.com/a/64174219/4628416 */
      cy.get('.blog-likes')
        .then(items => {
          const unsortedItems = items.map((index, html) => Cypress.$(html).text()).get();
          const sortedItems = unsortedItems.slice().sort((a, b) => b - a);
          expect(unsortedItems, 'Items are sorted').to.deep.equal(sortedItems);
        });

      cy.contains('Iceberg').click();
      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(4)');
      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(5)');

      cy.get('#return-to-bloglist-button').click();

      cy.get('.blog-likes')
        .then(items => {
          const unsortedItems = items.map((index, html) => Cypress.$(html).text()).get();
          const sortedItems = unsortedItems.slice().sort((a, b) => b - a);
          expect(unsortedItems, 'Items are sorted').to.deep.equal(sortedItems);
        });

      cy.contains('Guerrilla').click();
      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(5)');
      cy.get('.like-this-blog').click();
      cy.get('#toast').should('be.visible').contains('yay');
      cy.get('.blog-like-count').contains('(6)');

      cy.get('#return-to-bloglist-button').click();

      cy.get('.blog-likes')
        .then(items => {
          const unsortedItems = items.map((index, html) => Cypress.$(html).text()).get();
          const sortedItems = unsortedItems.slice().sort((a, b) => b - a);
          expect(unsortedItems, 'Items are sorted').to.deep.equal(sortedItems);
        });

    });
  });

});