describe('Fluxo criar 3 produtos e validar filtros', () => {
    const produtos = [
      { nome: 'Produto A', custo: '5,00' },
      { nome: 'Produto B', custo: '15,00' },
      { nome: 'Produto C', custo: '25,00' },
    ];
  
    before(() => {
      produtos.forEach(p => {
        cy.visit('/produtos/cadastro');
        cy.get('input[formcontrolname="descricao"]')
          .clear()
          .type(p.nome);
        cy.get('input[formcontrolname="custo"]')
          .clear()
          .type(p.custo);
        cy.get('button mat-icon')
          .contains('save')
          .click();
        cy.contains('Produto salvo com sucesso').should('be.visible');
      });
    });
  
    it('filtra por descrição corretamente', () => {
      cy.visit('/produtos');
      cy.get('input[formcontrolname="descricao"]')
        .clear()
        .type('Produto B');
      cy.get('button').contains('Filtrar').click();
  
      cy.get('table').within(() => {
        cy.contains('td', 'Produto B').should('exist');
        cy.contains('td', 'Produto A').should('not.exist');
        cy.contains('td', 'Produto C').should('not.exist');
      });
    });
  
    it('filtra por custo corretamente', () => {
      cy.visit('/produtos');
      cy.get('input[formcontrolname="custo"]')
        .clear()
        .type('15,00');
      cy.get('button').contains('Filtrar').click();
  
      cy.contains('td', 'Produto A').should('not.exist');
      cy.contains('td', 'Produto B').should('exist');
      cy.contains('td', 'Produto C').should('not.exist');
    });
  });
  