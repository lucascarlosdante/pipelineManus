// ***********************************************************
// Enhanced E2E Support File - Simplified Version
// ***********************************************************

// Import enhanced commands with Page Object Model
import './commands'

// Global configuration and optimizations
import { EnvironmentHelper } from './utils/EnvironmentHelper.js'
import { PerformanceHelper } from './utils/PerformanceHelper.js'

// =============================================================================
// GLOBAL BEFORE HOOKS
// =============================================================================

before(() => {
  // Configuração inicial única por sessão de testes
  console.log('🚀 [GLOBAL SETUP] Iniciando configuração global dos testes')
  
  // Limpa dados de teste anteriores
  cy.clearLocalStorage()
  cy.clearCookies()
  
  // Configura ambiente
  EnvironmentHelper.logEnvironmentInfo()
  EnvironmentHelper.setEnvironmentViewport()
  
  // Configura monitoramento de performance global
  PerformanceHelper.monitorNetworkRequests()
  
  console.log('✅ [GLOBAL SETUP] Configuração global concluída')
})

// =============================================================================
// GLOBAL BEFOREEACH HOOKS
// =============================================================================

beforeEach(() => {
  // Configuração antes de cada teste
  console.log('🔧 [BEFORE EACH] Configurando teste individual')
  
  // Limpa localStorage e cookies apenas se necessário
  if (Cypress.currentTest.title.includes('login') || Cypress.currentTest.title.includes('logout')) {
    cy.clearLocalStorage()
    cy.clearCookies()
  }
})

// =============================================================================
// GLOBAL AFTEREACH HOOKS
// =============================================================================

afterEach(() => {
  // Limpeza após cada teste
  const testTitle = Cypress.currentTest.title
  const testState = Cypress.currentTest.state
  
  console.log(`📋 [TEST END] ${testTitle} - Status: ${testState}`)
  
  // Screenshot em caso de falha
  if (testState === 'failed') {
    const screenshotName = `FAILED_${testTitle}_${Date.now()}`
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 100)
    
    cy.screenshot(screenshotName, {
      capture: 'viewport',
      blackout: ['[data-sensitive]'] // Oculta dados sensíveis
    })
  }
})

// =============================================================================
// GLOBAL AFTER HOOKS
// =============================================================================

after(() => {
  // Limpeza final após todos os testes
  console.log('🏁 [GLOBAL CLEANUP] Finalizando execução dos testes')
  
  // Limpa dados temporários
  cy.clearLocalStorage()
  cy.clearCookies()
  
  console.log('✅ [GLOBAL CLEANUP] Limpeza global concluída')
})

// =============================================================================
// EXCEPTION HANDLERS
// =============================================================================

// Previne que erros de aplicação quebrem os testes
Cypress.on('uncaught:exception', (err, runnable) => {
  // Lista de erros que podem ser ignorados
  const ignoredErrors = [
    'Script error.',
    'Non-Error promise rejection captured',
    'Network request failed',
    'Loading chunk',
    'ChunkLoadError'
  ]
  
  const shouldIgnore = ignoredErrors.some(ignoredError => 
    err.message.includes(ignoredError)
  )
  
  if (shouldIgnore) {
    console.log(`⚠️ [IGNORED ERROR] ${err.message}`)
    return false // Previne que o teste falhe
  }
  
  // Permite que outros erros quebrem o teste normalmente
  return true
})

console.log('🎯 [E2E SUPPORT] Sistema de testes otimizado carregado com sucesso')

// Import enhanced commands with Page Object Model
import './commands'

// Global configuration and optimizations
import { EnvironmentHelper } from './utils/EnvironmentHelper.js'
import { PerformanceHelper } from './utils/PerformanceHelper.js'
import { ApiHelper } from './helpers/ApiHelper.js'

// =============================================================================
// GLOBAL BEFORE HOOKS
// =============================================================================

before(() => {
  // Configuração inicial única por sessão de testes
  cy.log('🚀 [GLOBAL SETUP] Iniciando configuração global dos testes')
  
  // Limpa dados de teste anteriores
  cy.clearLocalStorage()
  cy.clearCookies()
  
  // Configura ambiente
  EnvironmentHelper.logEnvironmentInfo()
  EnvironmentHelper.setEnvironmentViewport()
  
  // Configura monitoramento de performance global
  PerformanceHelper.monitorNetworkRequests()
  
  cy.log('✅ [GLOBAL SETUP] Configuração global concluída')
})

// =============================================================================
// GLOBAL BEFOREEACH HOOKS
// =============================================================================

beforeEach(() => {
  // Configuração antes de cada teste
  
  // Estratégia simplificada sem cy.session por enquanto
  cy.log('� [BEFORE EACH] Configurando teste individual')
  
  // Limpa localStorage e cookies apenas se necessário
  if (Cypress.currentTest.title.includes('login') || Cypress.currentTest.title.includes('logout')) {
    cy.clearLocalStorage()
    cy.clearCookies()
  }
})

// =============================================================================
// GLOBAL AFTEREACH HOOKS
// =============================================================================

afterEach(() => {
  // Limpeza após cada teste
  const testTitle = Cypress.currentTest.title
  const testState = Cypress.currentTest.state
  
  cy.log(`📋 [TEST END] ${testTitle} - Status: ${testState}`)
  
  // Screenshot em caso de falha
  if (testState === 'failed') {
    const screenshotName = `FAILED_${testTitle}_${Date.now()}`
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 100)
    
    cy.screenshot(screenshotName, {
      capture: 'viewport',
      blackout: ['[data-sensitive]'] // Oculta dados sensíveis
    })
    
    // Log adicional de debug em falhas
    cy.window().then(win => {
      cy.task('log', `Test failure debug info:`)
      cy.task('log', `- URL: ${win.location.href}`)
      cy.task('log', `- User Agent: ${win.navigator.userAgent}`)
      cy.task('log', `- Screen: ${win.screen.width}x${win.screen.height}`)
      cy.task('log', `- Viewport: ${win.innerWidth}x${win.innerHeight}`)
    })
  }
  
  // Coleta métricas de performance se disponíveis
  cy.window().then(win => {
    if (win.performance && win.performance.memory) {
      const memory = win.performance.memory
      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        cy.log(`⚠️ [MEMORY WARNING] High memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
      }
    }
  })
})

// =============================================================================
// GLOBAL AFTER HOOKS
// =============================================================================

after(() => {
  // Limpeza final após todos os testes
  cy.log('🏁 [GLOBAL CLEANUP] Finalizando execução dos testes')
  
  // Gera relatório de performance se aplicável
  if (EnvironmentHelper.isLocal()) {
    PerformanceHelper.generatePerformanceReport()
  }
  
  // Limpa dados temporários
  cy.clearLocalStorage()
  cy.clearCookies()
  
  cy.log('✅ [GLOBAL CLEANUP] Limpeza global concluída')
})

// =============================================================================
// EXCEPTION HANDLERS
// =============================================================================

// Previne que erros de aplicação quebrem os testes
Cypress.on('uncaught:exception', (err, runnable) => {
  // Lista de erros que podem ser ignorados
  const ignoredErrors = [
    'Script error.',
    'Non-Error promise rejection captured',
    'Network request failed',
    'Loading chunk',
    'ChunkLoadError'
  ]
  
  const shouldIgnore = ignoredErrors.some(ignoredError => 
    err.message.includes(ignoredError)
  )
  
  if (shouldIgnore) {
    cy.log(`⚠️ [IGNORED ERROR] ${err.message}`)
    return false // Previne que o teste falhe
  }
  
  // Log do erro para debug
  cy.task('log', `Uncaught exception: ${err.message}`)
  cy.task('log', `Stack: ${err.stack}`)
  
  // Permite que outros erros quebrem o teste normalmente
  return true
})

// Handler para falhas de comando
Cypress.on('fail', (err, runnable) => {
  // Log detalhado da falha
  cy.task('log', `Command failure: ${err.message}`)
  
  // Re-throw para manter comportamento padrão
  throw err
})

// =============================================================================
// CUSTOM MATCHERS AND UTILITIES
// =============================================================================

// Adiciona matcher personalizado para verificar performance
chai.Assertion.addMethod('beFasterThan', function (expectedTime) {
  const obj = this._obj
  const actualTime = typeof obj === 'number' ? obj : parseFloat(obj)
  
  this.assert(
    actualTime < expectedTime,
    `expected ${actualTime}ms to be faster than ${expectedTime}ms`,
    `expected ${actualTime}ms not to be faster than ${expectedTime}ms`
  )
})

// =============================================================================
// GLOBAL CONFIGURATION
// =============================================================================

// Configurações que afetam todos os testes
const timeouts = EnvironmentHelper.getTimeouts()
if (timeouts) {
  // Não usar Cypress.config() para propriedades read-only
  // Apenas log das configurações
  cy.log(`⚙️ [CONFIG] Timeouts configurados: ${JSON.stringify(timeouts)}`)
}

cy.log('🎯 [E2E SUPPORT] Sistema de testes otimizado carregado com sucesso')

