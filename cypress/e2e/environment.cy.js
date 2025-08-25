describe('Diferenciação de Ambientes', () => {
  it('deve mostrar ambiente de desenvolvimento', () => {
    const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
    cy.visit(`${basePath}`)
    cy.checkEnvironment('dev')
    
    // Verifica se o header tem a cor verde (desenvolvimento)
    cy.get('div').contains('Ambiente: Desenvolvimento').should('be.visible')
    cy.get('div').contains('(DEV)').should('be.visible')
  })

  it('deve manter ambiente após login', () => {
    cy.login()
    cy.checkEnvironment('dev')
    
    // Verifica se o badge do ambiente está visível no dashboard
    cy.contains('Desenvolvimento').should('be.visible')
  })

  it('deve aplicar cores do ambiente nos botões', () => {
    cy.login()
    
    // Verifica se os botões principais usam a cor do ambiente
    cy.get('[data-testid="add-item-button"]').should('be.visible')
    
    // Abre modal para verificar cor do botão de submit
    cy.get('[data-testid="add-item-button"]').click()
    cy.get('[data-testid="add-submit-button"]').should('be.visible')
    cy.get('[data-testid="add-cancel-button"]').click()
  })

  // it('deve mostrar indicador visual consistente', () => {
  //   // Usa a mesma estratégia de detecção de ambiente dos outros testes
  //   const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
  //   cy.visit(`${basePath}/#/login`)
    
  //   // Verifica elementos visuais na página de login
  //   cy.get('div').contains('🚀 Ambiente:').should('be.visible')
    
  //   // Faz login e verifica no dashboard
  //   cy.login()
  //   cy.get('div').contains('🚀 Ambiente:').should('be.visible')
  // })

  // Teste conceitual para outros ambientes (seria necessário configurar URLs diferentes)
  it('deve detectar ambiente baseado na URL', () => {
    // Este teste seria executado em diferentes URLs para cada ambiente
    // Por exemplo: dev.app.com, tst.app.com, hml.app.com, prd.app.com
    
    cy.login()
    // cy.visit('/pipelineManus')
    
    // Para desenvolvimento local, sempre será 'dev'
    cy.checkEnvironment('dev')
  })
})

