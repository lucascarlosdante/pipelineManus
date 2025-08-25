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
  cy.log('🔄 [LOGIN] Iniciando processo de login...')
  
  const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
  cy.log(`📍 [LOGIN] BasePath: "${basePath}"`)
  
  cy.visit(`${basePath}/#/login`)
  cy.log(`✅ [LOGIN] Visitando: ${basePath}/#/login`)
  
  // Aguarda a página de login carregar completamente
  cy.log('⏳ [LOGIN] Aguardando página de login carregar...')
  cy.contains('Entrar', { timeout: 10000 }).should('be.visible')
  
  cy.log('📝 [LOGIN] Preenchendo credenciais...')
  cy.get('[data-testid="email-input"]', { timeout: 10000 }).type(email)
  cy.get('[data-testid="password-input"]', { timeout: 10000 }).type(password)
  
  cy.log('🖱️ [LOGIN] Clicando no botão de login...')
  cy.get('[data-testid="login-button"]', { timeout: 10000 }).click()
  
  // Aguarda a transição para o dashboard
  cy.log('⏳ [LOGIN] Aguardando redirecionamento para dashboard...')
  cy.location('hash', { timeout: 15000 }).should('include', '/dashboard')
  cy.contains('Dashboard', { timeout: 10000 }).should('be.visible')
  
  cy.log('✅ [LOGIN] Login concluído com sucesso!')
})

// Comando para fazer logout
Cypress.Commands.add('logout', () => {
  cy.log('🔄 [LOGOUT] Iniciando processo de logout...')
  
  cy.log('🔍 [LOGOUT] Procurando botão de logout...')
  
  // Procura por diferentes seletores possíveis para o botão de logout
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="logout-button"]').length > 0) {
      cy.log('✅ [LOGOUT] Botão encontrado via data-testid')
      cy.get('[data-testid="logout-button"]').click()
    } else if ($body.find('button:contains("Logout")').length > 0) {
      cy.log('✅ [LOGOUT] Botão encontrado via texto "Logout"')
      cy.contains('button', 'Logout').click()
    } else if ($body.find('button:contains("Sair")').length > 0) {
      cy.log('✅ [LOGOUT] Botão encontrado via texto "Sair"')
      cy.contains('button', 'Sair').click()
    } else {
      cy.log('❌ [LOGOUT] Botão de logout não encontrado!')
      // Lista todos os botões disponíveis para debug
      cy.get('button').then(($buttons) => {
        const buttonTexts = Array.from($buttons).map(btn => btn.textContent.trim())
        cy.log(`📝 [LOGOUT] Botões disponíveis: ${buttonTexts.join(', ')}`)
      })
      // Força o teste a falhar com uma mensagem clara
      cy.get('[data-testid="logout-button"]', { timeout: 15000 })
        .should('be.visible')
        .click()
    }
  })
  
  cy.log('✅ [LOGOUT] Botão clicado, aguardando redirecionamento...')
  
  // No ambiente CI, aguarda mais tempo para o redirecionamento
  const timeout = Cypress.env('CI') ? 25000 : 15000
  
  // Aguarda a página carregar antes de verificar a URL
  cy.log(`⏳ [LOGOUT] Aguardando mudança de hash (timeout: ${timeout}ms)...`)
  cy.location('hash', { timeout }).should('include', '/login')
  
  cy.log('✅ [LOGOUT] Hash alterado para login, verificando elemento...')
  // Verifica se o elemento de login está visível (garantia extra)
  cy.contains('Entrar', { timeout: 15000 }).should('be.visible')
  
  cy.log('✅ [LOGOUT] Logout concluído com sucesso!')
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

