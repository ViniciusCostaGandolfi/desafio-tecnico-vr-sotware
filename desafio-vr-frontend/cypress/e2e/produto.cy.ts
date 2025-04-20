describe('Fluxo: criar → editar → excluir produto', () => {
  const descricao = 'Produto E2E Completo';
  const custo     = '10,00';

  it('deve criar um produto, editar e depois excluir o produto', () => {
    cy.visit('/produtos/cadastro');
    cy.get('input[formcontrolname="descricao"]').type(descricao);
    cy.get('input[formcontrolname="custo"]')
      .clear()
      .type(custo);
    cy.contains('button mat-icon', 'save').click();
    cy.contains('Produto salvo com sucesso').should('be.visible');

    cy.contains('td', descricao)
      .parent('tr')
      .within(() => {
        cy.get('button[mattooltip="Editar"]').click();
      });
    cy.url().should('match', /\/produtos\/cadastro\/\d+$/);

    cy.get('input[formcontrolname="descricao"]')
      .clear()
      .type(`${descricao} - Editado`);
    cy.contains('button mat-icon', 'save').click();
    cy.contains('Produto salvo com sucesso').should('be.visible');

    cy.contains('td', `${descricao} - Editado`).should('exist');

    cy.contains('td', `${descricao} - Editado`)
      .parent('tr')
      .within(() => {
        cy.get('button[mattooltip="Excluir"]').click();
      });

    cy.get('mat-dialog-container')
      .contains('button', /^Sim$|^Confirmar$/)
      .click();
  });
});
