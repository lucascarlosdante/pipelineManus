/**
 * BasePage - Classe base para todas as páginas
 * Contém métodos comuns e utilitários reutilizáveis
 */
export class BasePage {
  constructor() {
    this.timeout = {
      short: 5000,
      medium: 10000,
      long: 30000
    }
  }

  /**
   * Visita uma URL com tratamento de ambiente
   */
  visit(path = '') {
    const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
    const fullPath = `${basePath}${path}`
    
    cy.log(`📍 [NAVIGATION] Visitando: ${fullPath}`)
    cy.visit(fullPath)
    return this
  }

  /**
   * Aguarda elemento estar visível com retry automático
   */
  waitForElement(selector, timeout = this.timeout.medium) {
    cy.log(`⏳ [WAIT] Aguardando elemento: ${selector}`)
    cy.get(selector, { timeout }).should('be.visible')
    return this
  }

  /**
   * Clica em elemento com tratamento de erros
   */
  clickElement(selector, options = {}) {
    cy.log(`🖱️ [CLICK] Clicando em: ${selector}`)
    cy.get(selector).should('be.visible').click(options)
    return this
  }

  /**
   * Preenche campo com validação
   */
  fillField(selector, value, options = {}) {
    cy.log(`📝 [INPUT] Preenchendo ${selector} com: ${value}`)
    
    const element = cy.get(selector).should('be.visible')
    
    if (options.clear !== false) {
      element.clear()
    }
    
    element.type(value, options)
    return this
  }

  /**
   * Seleciona opção em dropdown/select
   */
  selectOption(selector, optionText) {
    cy.log(`🎯 [SELECT] Selecionando "${optionText}" em: ${selector}`)
    cy.get(selector).click()
    cy.contains(optionText).click()
    return this
  }

  /**
   * Verifica se texto está presente na página
   */
  shouldContainText(text) {
    cy.log(`✅ [VERIFY] Verificando texto: ${text}`)
    cy.contains(text).should('be.visible')
    return this
  }

  /**
   * Verifica URL atual
   */
  shouldBeAtPath(path) {
    cy.log(`🔍 [VERIFY] Verificando URL contém: ${path}`)
    cy.location('hash').should('include', path)
    return this
  }

  /**
   * Aguarda loading/spinner desaparecer
   */
  waitForLoading() {
    // Aguarda possíveis spinners/loading desaparecerem
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid*="loading"], [data-testid*="spinner"]').length > 0) {
        cy.get('[data-testid*="loading"], [data-testid*="spinner"]', { timeout: this.timeout.long })
          .should('not.exist')
      }
    })
    return this
  }

  /**
   * Screenshot com nome customizado
   */
  takeScreenshot(name) {
    cy.screenshot(name)
    return this
  }

  /**
   * Aguarda elemento não existir (útil para modais)
   */
  shouldNotExist(selector) {
    cy.log(`❌ [VERIFY] Verificando que elemento não existe: ${selector}`)
    cy.get(selector).should('not.exist')
    return this
  }

  /**
   * Aguarda um tempo específico (usar apenas quando necessário)
   */
  wait(milliseconds) {
    cy.log(`⏸️ [WAIT] Aguardando ${milliseconds}ms`)
    cy.wait(milliseconds)
    return this
  }

  /**
   * Executa ação condicional baseada na existência de elemento
   */
  ifExists(selector, callback) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        callback()
      }
    })
    return this
  }

  /**
   * Rola até elemento
   */
  scrollToElement(selector) {
    cy.log(`📜 [SCROLL] Rolando até elemento: ${selector}`)
    cy.get(selector).scrollIntoView()
    return this
  }

  /**
   * Verifica que elemento está habilitado/desabilitado
   */
  shouldBeEnabled(selector) {
    cy.get(selector).should('be.enabled')
    return this
  }

  shouldBeDisabled(selector) {
    cy.get(selector).should('be.disabled')
    return this
  }
}
