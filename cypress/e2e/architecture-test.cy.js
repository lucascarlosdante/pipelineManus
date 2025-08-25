/**
 * Teste Simples para Validar Nova Arquitetura
 */

import { LoginPage } from '../support/pages/LoginPage.js'

describe('🧪 Validação da Nova Arquitetura', () => {
  let loginPage

  beforeEach(() => {
    loginPage = new LoginPage()
  })

  it('deve carregar página de login usando Page Objects', () => {
    loginPage.goto()
    loginPage.waitForPageLoad()
    
    cy.log('✅ Page Objects funcionando corretamente')
  })

  it('deve fazer login usando novo sistema', () => {
    loginPage.goto()
    loginPage.login()
    
    // Verifica se chegou no dashboard
    cy.location('hash').should('include', '/dashboard')
    cy.contains('Dashboard').should('be.visible')
    
    cy.log('✅ Sistema de login funcionando corretamente')
  })

  it('deve usar comando customizado optimizado', () => {
    // Teste do comando customizado refatorado
    cy.login()
    
    cy.location('hash').should('include', '/dashboard')
    cy.contains('Dashboard').should('be.visible')
    
    cy.log('✅ Comandos customizados funcionando corretamente')
  })
})
