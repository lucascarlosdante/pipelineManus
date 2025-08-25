// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para fazer login
Cypress.Commands.add('login', (email = 'teste@email.com', password = '123456') => {
  const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
  cy.visit(`${basePath}/#/login`)
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
  cy.url().should('include', '#/dashboard')
})

// Comando para fazer logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '#/login')
})

// Comando para adicionar um item
Cypress.Commands.add('addItem', (name, description, priority = 'medium', category = 'geral') => {
  cy.get('[data-testid="add-item-button"]').click()
  cy.get('[data-testid="add-name-input"]').type(name)
  cy.get('[data-testid="add-description-input"]').type(description)
  cy.get('[data-testid="add-priority-select"]').click()
  cy.contains(priority === 'low' ? 'Baixa' : priority === 'high' ? 'Alta' : 'Média').click()
  cy.get('[data-testid="add-category-select"]').click()
  cy.contains(category === 'trabalho' ? 'Trabalho' : category === 'pessoal' ? 'Pessoal' : category === 'projeto' ? 'Projeto' : 'Geral').click()
  cy.get('[data-testid="add-submit-button"]').click()
})

// Comando para verificar se um item existe na tabela
Cypress.Commands.add('itemShouldExist', (itemName) => {
  cy.get('[data-testid="items-table"]').should('contain', itemName)
})

// Comando para verificar o ambiente atual
Cypress.Commands.add('checkEnvironment', (environment) => {
  const envNames = {
    dev: 'Desenvolvimento',
    tst: 'Teste',
    hml: 'Homologação',
    prd: 'Produção'
  }
  cy.contains(`Ambiente: ${envNames[environment]}`).should('be.visible')
})

