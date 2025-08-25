// ***********************************************
// Enhanced Custom Commands with Page Object Model
// 
// Importação das classes de apoio
// ***********************************************

import { LoginPage } from './pages/LoginPage.js'
import { RegisterPage } from './pages/RegisterPage.js'
import { DashboardPage } from './pages/DashboardPage.js'
import { DataHelper } from './utils/DataHelper.js'
import { EnvironmentHelper } from './utils/EnvironmentHelper.js'
import { PerformanceHelper } from './utils/PerformanceHelper.js'
import { ApiHelper } from './helpers/ApiHelper.js'

// Inicialização automática do ambiente
beforeEach(() => {
  EnvironmentHelper.configureCypress()
  EnvironmentHelper.logEnvironmentInfo()
})

// =============================================================================
// COMANDOS DE AUTENTICAÇÃO OTIMIZADOS
// =============================================================================

/**
 * Comando de login otimizado usando Page Objects
 */
Cypress.Commands.add('login', (email = 'teste@email.com', password = '123456') => {
  PerformanceHelper.startTimer('login_operation')
  
  const loginPage = new LoginPage()
  loginPage.goto().login(email, password)
  
  PerformanceHelper.endTimer('login_operation')
  PerformanceHelper.measurePageLoad('dashboard')
})

/**
 * Login rápido para testes que precisam estar autenticados
 */
Cypress.Commands.add('fastLogin', () => {
  // Login direto via localStorage (bypassa UI para velocidade)
  cy.window().then(win => {
    win.localStorage.setItem('authToken', 'test-token')
    win.localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Usuário Teste',
      email: 'teste@email.com'
    }))
  })
  
  const dashboardPage = new DashboardPage()
  dashboardPage.goto()
  
  cy.log('⚡ [FAST LOGIN] Login via localStorage concluído')
})

/**
 * Login com dados de fixture
 */
Cypress.Commands.add('loginWithFixture', (userType = 'validUser') => {
  cy.fixture('users').then(users => {
    const user = users[userType]
    if (!user) {
      throw new Error(`Usuário ${userType} não encontrado nas fixtures`)
    }
    
    const loginPage = new LoginPage()
    loginPage.goto().login(user.email, user.password)
  })
})

/**
 * Comando de logout otimizado
 */
Cypress.Commands.add('logout', () => {
  const dashboardPage = new DashboardPage()
  dashboardPage.logout()
})

// =============================================================================
// COMANDOS DE CRUD OTIMIZADOS
// =============================================================================

/**
 * Adiciona item usando Page Objects
 */
Cypress.Commands.add('addItem', (itemData = {}) => {
  PerformanceHelper.startTimer('add_item_operation')
  
  const dashboardPage = new DashboardPage()
  dashboardPage.addItem(itemData)
  
  PerformanceHelper.endTimer('add_item_operation')
})

/**
 * Adiciona múltiplos itens de forma eficiente
 */
Cypress.Commands.add('addMultipleItems', (count = 3, baseData = {}) => {
  const items = DataHelper.generateMultipleItems(count, baseData)
  const dashboardPage = new DashboardPage()
  
  items.forEach((item, index) => {
    cy.log(`📝 [BULK ADD] Adicionando item ${index + 1}/${count}`)
    dashboardPage.addItem(item)
  })
})

/**
 * Verifica existência de item na tabela
 */
Cypress.Commands.add('itemShouldExist', (itemName) => {
  const dashboardPage = new DashboardPage()
  dashboardPage.shouldItemExist(itemName)
})

/**
 * Verifica que item não existe
 */
Cypress.Commands.add('itemShouldNotExist', (itemName) => {
  const dashboardPage = new DashboardPage()
  dashboardPage.shouldItemNotExist(itemName)
})

// =============================================================================
// COMANDOS DE AMBIENTE E VERIFICAÇÃO
// =============================================================================

/**
 * Verifica ambiente atual
 */
Cypress.Commands.add('checkEnvironment', (expectedEnvironment) => {
  const dashboardPage = new DashboardPage()
  dashboardPage.shouldShowEnvironment(expectedEnvironment)
})

/**
 * Comando para setup de teste com dados limpos
 */
Cypress.Commands.add('setupTest', (testName, options = {}) => {
  cy.log(`� [SETUP] Iniciando teste: ${testName}`)
  
  // Configura ambiente
  EnvironmentHelper.setEnvironmentViewport()
  
  // Configura mocks se necessário
  if (options.mockApi) {
    ApiHelper.setupCommonInterceptions()
  }
  
  // Login automático se necessário
  if (options.requireAuth !== false) {
    cy.fastLogin()
  }
  
  // Performance monitoring se habilitado
  if (options.monitorPerformance) {
    PerformanceHelper.monitorNetworkRequests()
    PerformanceHelper.monitorMemoryUsage(testName)
  }
})

// =============================================================================
// COMANDOS DE VALIDAÇÃO E VERIFICAÇÃO
// =============================================================================

/**
 * Verifica loading/spinner desapareceu
 */
Cypress.Commands.add('shouldFinishLoading', (timeout = 10000) => {
  cy.get('[data-testid*="loading"], [data-testid*="spinner"], .loading', { timeout })
    .should('not.exist')
})

/**
 * Aguarda elemento de forma inteligente
 */
Cypress.Commands.add('waitForElementSmart', (selector, maxWait = 10000) => {
  PerformanceHelper.waitForElementSmart(selector, maxWait)
})

/**
 * Screenshot inteligente com nomeação automática
 */
Cypress.Commands.add('smartScreenshot', (name = null) => {
  const screenshotName = name || `${Cypress.currentTest.title}_${Date.now()}`
  PerformanceHelper.smartScreenshot(screenshotName)
})

// =============================================================================
// COMANDOS DE DADOS E FIXTURES
// =============================================================================

/**
 * Carrega e retorna dados de fixture
 */
Cypress.Commands.add('loadFixture', (fixtureName, dataKey = null) => {
  return cy.fixture(fixtureName).then(data => {
    return dataKey ? data[dataKey] : data
  })
})

/**
 * Gera dados únicos para teste
 */
Cypress.Commands.add('generateTestData', (type = 'user', overrides = {}) => {
  let data
  
  switch (type) {
    case 'user':
      data = DataHelper.generateUserData(overrides)
      break
    case 'item':
      data = DataHelper.generateItemData(overrides)
      break
    default:
      throw new Error(`Tipo de dados não suportado: ${type}`)
  }
  
  cy.wrap(data).as(`generated_${type}_data`)
  return cy.wrap(data)
})

// =============================================================================
// COMANDOS DE DEBUG E DESENVOLVIMENTO
// =============================================================================

/**
 * Log de debug com contexto
 */
Cypress.Commands.add('debugLog', (message, data = null) => {
  const timestamp = new Date().toISOString()
  const testTitle = Cypress.currentTest.title
  const debugMessage = `🔍 [DEBUG] ${timestamp} - ${testTitle}: ${message}`
  
  cy.log(debugMessage)
  cy.task('log', debugMessage)
  
  if (data) {
    cy.task('log', JSON.stringify(data, null, 2))
  }
})

/**
 * Pausa execução em ambiente de desenvolvimento
 */
Cypress.Commands.add('debugPause', () => {
  if (EnvironmentHelper.isLocal()) {
    cy.pause()
  } else {
    cy.log('⏭️ [DEBUG] Pause ignorado em ambiente CI')
  }
})

// =============================================================================
// COMANDOS LEGACY (mantidos para compatibilidade)
// =============================================================================

