// ***********************************************************
// Enhanced E2E Support File - Clean Version
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
Cypress.on('uncaught:exception', (err) => {
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
