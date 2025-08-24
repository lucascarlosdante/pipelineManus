describe('Dashboard - CRUD de Itens', () => {
  beforeEach(() => {
    cy.login()
  })

  it('deve exibir dashboard com itens iniciais', () => {
    cy.contains('Dashboard').should('be.visible')
    cy.contains('Itens (3)').should('be.visible')
    cy.get('[data-testid="items-table"]').should('be.visible')
    
    // Verifica itens iniciais 
    cy.itemShouldExist('Item de Exemplo 1')
    cy.itemShouldExist('Item de Exemplo 2')
    cy.itemShouldExist('Item de Exemplo 3')
  })

  it('deve adicionar novo item', () => {
    const itemName = 'Novo Item de Teste'
    const itemDescription = 'Descrição do novo item de teste'
    
    cy.get('[data-testid="add-item-button"]').click()
    cy.get('[data-testid="add-item-modal"]').should('be.visible')
    
    cy.get('[data-testid="add-name-input"]').type(itemName)
    cy.get('[data-testid="add-description-input"]').type(itemDescription)
    
    cy.get('[data-testid="add-priority-select"]').click()
    cy.contains('Alta').click()
    
    cy.get('[data-testid="add-category-select"]').click()
    cy.contains('Trabalho').click()
    
    cy.get('[data-testid="add-submit-button"]').click()
    
    cy.get('[data-testid="add-item-modal"]').should('not.exist')
    cy.itemShouldExist(itemName)
    cy.contains('Itens (4)').should('be.visible')
  })

  it('deve cancelar adição de item', () => {
    cy.get('[data-testid="add-item-button"]').click()
    cy.get('[data-testid="add-item-modal"]').should('be.visible')
    
    cy.get('[data-testid="add-cancel-button"]').click()
    cy.get('[data-testid="add-item-modal"]').should('not.exist')
  })

  it('deve buscar itens', () => {
    cy.get('[data-testid="search-input"]').type('Exemplo 1')
    cy.itemShouldExist('Item de Exemplo 1')
    cy.get('[data-testid="items-table"]').should('not.contain', 'Item de Exemplo 2')
    cy.get('[data-testid="items-table"]').should('not.contain', 'Item de Exemplo 3')
  })

  it('deve filtrar por prioridade', () => {
    cy.get('[data-testid="priority-filter"]').click()
    cy.contains('Alta').click()
    
    // Assumindo que os itens iniciais não têm prioridade alta
    cy.contains('Nenhum item encontrado').should('be.visible')
  })

  it('deve selecionar itens individuais', () => {
    cy.get('[data-testid="select-item-1"]').click()
    cy.get('[data-testid="bulk-delete-button"]').should('be.visible')
    cy.get('[data-testid="bulk-delete-button"]').should('contain', '(1)')
  })

  it('deve selecionar todos os itens', () => {
    cy.get('[data-testid="select-all-checkbox"]').click()
    cy.get('[data-testid="bulk-delete-button"]').should('be.visible')
    cy.get('[data-testid="bulk-delete-button"]').should('contain', '(3)')
  })

  it('deve editar item', () => {
    cy.get('[data-testid="item-actions-1"]').click()
    cy.get('[data-testid="edit-item-1"]').click()
    
    cy.get('[data-testid="edit-item-modal"]').should('be.visible')
    cy.get('[data-testid="edit-name-input"]').clear().type('Item Editado')
    cy.get('[data-testid="edit-submit-button"]').click()
    
    cy.get('[data-testid="edit-item-modal"]').should('not.exist')
    cy.itemShouldExist('Item Editado')
  })

  it('deve excluir item individual', () => {
    cy.get('[data-testid="item-actions-1"]').click()
    cy.get('[data-testid="delete-item-1"]').click()
    
    cy.contains('Itens (2)').should('be.visible')
    cy.get('[data-testid="items-table"]').should('not.contain', 'Item de Exemplo 1')
  })

  it('deve excluir itens em lote', () => {
    cy.get('[data-testid="select-item-1"]').click()
    cy.get('[data-testid="select-item-2"]').click()
    cy.get('[data-testid="bulk-delete-button"]').click()
    
    cy.contains('Itens (1)').should('be.visible')
  })

  it('deve alternar status de completado', () => {
    cy.get('[data-testid="toggle-complete-1"]').click()
    // Verifica se o ícone mudou (seria necessário verificar a classe ou atributo específico)
  })

  it('deve fazer logout', () => {
    cy.logout()
  })

  it('deve mostrar informações do usuário', () => {
    cy.contains('teste').should('be.visible') // Nome do usuário
    cy.checkEnvironment('dev')
  })
})

