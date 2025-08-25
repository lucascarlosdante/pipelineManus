/**
 * Testes de Autenticação Refatorados - Usando Page Object Model
 * 
 * Este arquivo demonstra o uso das novas funcionalidades:
 * - Page Object Model
 * - Fixtures para dados de teste
 * - Comandos customizados otimizados
 * - Monitoramento de performance
 */

import { LoginPage } from '../support/pages/LoginPage.js'
import { RegisterPage } from '../support/pages/RegisterPage.js'
import { DashboardPage } from '../support/pages/DashboardPage.js'

describe('🔐 Autenticação - Sistema Otimizado', () => {
  let loginPage, registerPage, dashboardPage
  let testUsers

  before(() => {
    // Carrega dados de fixture
    cy.loadFixture('users').then(users => {
      testUsers = users
    })
  })

  beforeEach(() => {
    // Inicializa Page Objects
    loginPage = new LoginPage()
    registerPage = new RegisterPage()
    dashboardPage = new DashboardPage()

    // Setup do teste com configurações otimizadas
    cy.setupTest('Autenticação Test', {
      requireAuth: false, // Este teste faz login manualmente
      monitorPerformance: true,
      mockApi: false
    })
  })

  context('📋 Página de Login', () => {
    beforeEach(() => {
      loginPage.goto()
    })

    it('deve exibir todos os elementos da página de login', () => {
      loginPage.shouldHaveAllElements()
    })

    it('deve fazer login com dados válidos usando fixture', () => {
      // Usa dados de fixture em vez de dados hardcoded
      const user = testUsers.validUser
      
      loginPage
        .login(user.email, user.password)
      
      dashboardPage
        .shouldHaveAllMainElements()
        .shouldShowUserInfo('teste') // Ajustar conforme a implementação
    })

    it('deve mostrar erros de validação com dados inválidos', () => {
      const invalidUser = testUsers.invalidUsers.invalidEmail
      
      loginPage
        .loginWithInvalidData(invalidUser.email, '123')
        .shouldHaveEmailError()
        .shouldHavePasswordError()
    })

    it('deve alternar visibilidade da senha', () => {
      loginPage
        .passwordShouldBeHidden()
        .togglePasswordVisibility()
        .passwordShouldBeVisible()
        .togglePasswordVisibility()
        .passwordShouldBeHidden()
    })

    it('deve navegar para página de registro', () => {
      loginPage.goToRegister()
      registerPage.waitForPageLoad()
    })
  })

  context('📝 Funcionalidades de Login', () => {
    it('deve fazer login usando comando customizado', () => {
      // Demonstra o uso do comando customizado otimizado
      cy.login() // Usa credenciais padrão
      dashboardPage.shouldHaveAllMainElements()
    })

    it('deve fazer login com dados de fixture usando comando', () => {
      cy.loginWithFixture('validUser2')
      dashboardPage.shouldHaveAllMainElements()
    })

    it('deve fazer logout corretamente', () => {
      cy.login()
      cy.logout()
      loginPage.waitForPageLoad()
    })
  })

  context('🔄 Fluxo de Registro', () => {
    beforeEach(() => {
      registerPage.goto()
    })

    it('deve exibir todos os elementos do registro', () => {
      registerPage.shouldHaveAllElements()
    })

    it('deve fazer registro com dados gerados dinamicamente', () => {
      // Demonstra geração de dados únicos
      cy.generateTestData('user', { 
        department: 'Tecnologia da Informação' 
      }).then(userData => {
        registerPage.register(userData)
        dashboardPage.shouldHaveAllMainElements()
      })
    })

    it('deve validar campos obrigatórios', () => {
      registerPage
        .registerWithInvalidData()
        .shouldHaveNameError()
        .shouldHaveEmailError()
        .shouldHavePhoneError()
        .shouldHaveDepartmentError()
        .shouldHavePasswordError()
        .shouldHaveTermsError()
    })

    it('deve validar confirmação de senha', () => {
      registerPage
        .fillMismatchedPasswords()
        .clickRegister()
        .shouldHavePasswordMismatchError()
    })

    it('deve alternar visibilidade das senhas', () => {
      registerPage
        .passwordsShouldBeHidden()
        .togglePasswordVisibility()
        .toggleConfirmPasswordVisibility()
        .passwordsShouldBeVisible()
    })
  })

  context('🌍 Testes de Ambiente', () => {
    it('deve verificar ambiente de desenvolvimento', () => {
      cy.login()
      cy.checkEnvironment('dev')
    })

    it('deve manter ambiente após navegação', () => {
      loginPage.goto()
      cy.checkEnvironment('dev')
      
      cy.login()
      cy.checkEnvironment('dev')
      
      cy.logout()
      cy.checkEnvironment('dev')
    })
  })

  context('⚡ Testes de Performance', () => {
    it('deve carregar página de login rapidamente', () => {
      cy.visit('/') // Página inicial
      
      // Mede tempo de navegação para login
      loginPage.goto()
      
      // Verifica que carregou em tempo hábil (implementar verificação personalizada)
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('deve fazer login em tempo aceitável', () => {
      loginPage.goto()
      
      const startTime = performance.now()
      
      loginPage.login()
      
      cy.window().then(() => {
        const endTime = performance.now()
        const loginTime = endTime - startTime
        
        // Verifica que login foi concluído em menos de 5 segundos
        expect(loginTime).to.be.lessThan(5000)
        cy.debugLog(`Login completado em ${loginTime.toFixed(2)}ms`)
      })
    })
  })

  afterEach(() => {
    // Screenshot em caso de falha (automático via hooks globais)
    // Logs de debug se necessário
    if (Cypress.currentTest.state === 'failed') {
      cy.debugLog('Test failed', {
        title: Cypress.currentTest.title,
        url: window.location.href
      })
    }
  })
})
