describe('Cadastro de Usuário', () => {
  beforeEach(() => {
    cy.visit('/pipelineManus/#/register')
  })

  it('deve exibir formulário de cadastro', () => {
    cy.contains('Criar Conta').should('be.visible')
    cy.get('[data-testid="name-input"]').should('be.visible')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="phone-input"]').should('be.visible')
    cy.get('[data-testid="department-select"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="confirm-password-input"]').should('be.visible')
    cy.get('[data-testid="accept-terms-checkbox"]').should('be.visible')
    cy.get('[data-testid="newsletter-checkbox"]').should('be.visible')
  })

  it('deve fazer cadastro com dados válidos', () => {
    cy.get('[data-testid="name-input"]').type('João Silva')
    cy.get('[data-testid="email-input"]').type('joao@email.com')
    cy.get('[data-testid="phone-input"]').type('11999999999')
    
    cy.get('[data-testid="department-select"]').click()
    cy.contains('Tecnologia da Informação').click()
    
    cy.get('[data-testid="password-input"]').type('123456')
    cy.get('[data-testid="confirm-password-input"]').type('123456')
    
    cy.get('[data-testid="accept-terms-checkbox"]').click()
    cy.get('[data-testid="newsletter-checkbox"]').click()
    
    cy.get('[data-testid="register-button"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.contains('Dashboard').should('be.visible')
  })

  it('deve mostrar erros de validação', () => {
    cy.get('[data-testid="register-button"]').click()
    
    cy.get('[data-testid="name-error"]').should('be.visible')
    cy.get('[data-testid="email-error"]').should('be.visible')
    cy.get('[data-testid="phone-error"]').should('be.visible')
    cy.get('[data-testid="department-error"]').should('be.visible')
    cy.get('[data-testid="password-error"]').should('be.visible')
    cy.get('[data-testid="accept-terms-error"]').should('be.visible')
  })

  it('deve validar confirmação de senha', () => {
    cy.get('[data-testid="password-input"]').type('123456')
    cy.get('[data-testid="confirm-password-input"]').type('654321')
    cy.get('[data-testid="register-button"]').click()
    
    cy.get('[data-testid="confirm-password-error"]').should('contain', 'Senhas não coincidem')
  })

  it('deve navegar para página de login', () => {
    cy.get('[data-testid="login-link"]').click()
    cy.url().should('include', '/login')
    cy.contains('Entrar').should('be.visible')
  })

  it('deve mostrar/ocultar senhas', () => {
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
    cy.get('[data-testid="toggle-password"]').click()
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text')
    
    cy.get('[data-testid="confirm-password-input"]').should('have.attr', 'type', 'password')
    cy.get('[data-testid="toggle-confirm-password"]').click()
    cy.get('[data-testid="confirm-password-input"]').should('have.attr', 'type', 'text')
  })

  it('deve permitir clicar nos links de termos e privacidade', () => {
    cy.get('[data-testid="terms-link"]').should('be.visible')
    cy.get('[data-testid="privacy-link"]').should('be.visible')
  })
})

