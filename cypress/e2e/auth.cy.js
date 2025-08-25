describe('Autenticação', () => {
  beforeEach(() => {
    const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
    cy.visit(`${basePath}`)
    
    // Aguarda a página carregar completamente antes de prosseguir
    cy.get('body', { timeout: 15000 }).should('be.visible')
  })

  it('deve redirecionar para login quando não autenticado', () => {
    cy.url().should('include', '#/login')
    cy.contains('Entrar').should('be.visible')
  })

  it('deve mostrar o ambiente de desenvolvimento', () => {
    cy.checkEnvironment('dev')
  })

  it('deve fazer login com credenciais válidas', () => {
    cy.get('[data-testid="email-input"]').type('teste@email.com')
    cy.get('[data-testid="password-input"]').type('123456')
    cy.get('[data-testid="login-button"]').click()
    
    cy.url().should('include', '#/dashboard')
    cy.contains('Dashboard').should('be.visible')
    cy.contains('teste').should('be.visible') // Nome do usuário
  })

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.get('[data-testid="email-input"]').type('email-invalido')
    cy.get('[data-testid="password-input"]').type('123')
    cy.get('[data-testid="login-button"]').click()
    
    // Aguarda um pouco e verifica se ainda está na página de login (não fez login)
    cy.wait(1000)
    cy.url().should('include', '#/login')
  })

  it('deve navegar para página de cadastro', () => {
    cy.get('[data-testid="register-link"]').click()
    cy.url().should('include', '#/register')
    cy.contains('Criar Conta').should('be.visible')
  })

  it('deve fazer logout', () => {
    cy.get('[data-testid="email-input"]').type('teste@email.com')
    cy.get('[data-testid="password-input"]').type('123456')
    cy.get('[data-testid="login-button"]').click()
    
    cy.url().should('include', '#/dashboard')
    // cy.contains('Dashboard').should('be.visible')
    cy.contains('Dashboard', { timeout: 100 }).should('be.visible')
    
    cy.log('📊 Dashboard carregado, aguardando estabilização...')
    // Aguarda um pouco para garantir que tudo carregou
    // cy.wait(2000)
    
    cy.log(' Fazendo logout...')
    // Agora faz logout
    cy.logout()
    
    cy.log('✅ Logout concluído com sucesso!')
  })

  it('deve mostrar/ocultar senha', () => {
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
    cy.get('[data-testid="toggle-password"]').click()
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text')
    cy.get('[data-testid="toggle-password"]').click()
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
  })
})

