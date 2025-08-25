/**
 * Environment Helper - Utilitários para detecção e configuração de ambiente
 */

export class EnvironmentHelper {
  /**
   * Detecta o ambiente atual baseado em variáveis Cypress
   */
  static getCurrentEnvironment() {
    // Verifica se está no CI
    if (Cypress.env('CI')) {
      return 'ci'
    }
    
    // Verifica variáveis específicas de ambiente
    const envVar = Cypress.env('ENVIRONMENT') || Cypress.env('NODE_ENV')
    
    if (envVar) {
      return envVar.toLowerCase()
    }
    
    // Detecta baseado na URL
    const baseUrl = Cypress.config('baseUrl') || ''
    
    if (baseUrl.includes('localhost:5173')) {
      return 'dev'
    } else if (baseUrl.includes('localhost:4173')) {
      return 'preview'  
    } else if (baseUrl.includes('tst.')) {
      return 'tst'
    } else if (baseUrl.includes('hml.')) {
      return 'hml'
    } else if (baseUrl.includes('prd.')) {
      return 'prd'
    }
    
    return 'dev' // Padrão
  }

  /**
   * Retorna basePath baseado no ambiente
   */
  static getBasePath() {
    return Cypress.env('CI') ? '/pipelineManus' : ''
  }

  /**
   * Constrói URL completa para navegação
   */
  static buildUrl(path = '') {
    const basePath = this.getBasePath()
    return `${basePath}${path}`
  }

  /**
   * Retorna configurações específicas do ambiente
   */
  static getEnvironmentConfig(env = null) {
    const currentEnv = env || this.getCurrentEnvironment()
    
    const configs = {
      dev: {
        timeout: 10000,
        retries: 1,
        baseUrl: 'http://localhost:5173',
        name: 'Desenvolvimento',
        code: 'DEV'
      },
      preview: {
        timeout: 15000,
        retries: 2, 
        baseUrl: 'http://localhost:4173',
        name: 'Preview',
        code: 'PREV'
      },
      ci: {
        timeout: 30000,
        retries: 3,
        baseUrl: 'http://localhost:4173',
        basePath: '/pipelineManus',
        name: 'CI/CD',
        code: 'CI'
      },
      tst: {
        timeout: 20000,
        retries: 2,
        name: 'Teste',
        code: 'TST'
      },
      hml: {
        timeout: 15000, 
        retries: 2,
        name: 'Homologação',
        code: 'HML'
      },
      prd: {
        timeout: 25000,
        retries: 3,
        name: 'Produção',
        code: 'PRD'
      }
    }
    
    return configs[currentEnv] || configs.dev
  }

  /**
   * Verifica se está executando no CI
   */
  static isCI() {
    return Boolean(Cypress.env('CI'))
  }

  /**
   * Verifica se está executando localmente
   */
  static isLocal() {
    return !this.isCI()
  }

  /**
   * Retorna timeouts otimizados baseados no ambiente
   */
  static getTimeouts() {
    const config = this.getEnvironmentConfig()
    
    return {
      short: config.timeout * 0.3,
      medium: config.timeout,
      long: config.timeout * 2,
      extraLong: config.timeout * 3
    }
  }

  /**
   * Configura Cypress baseado no ambiente
   */
  static configureCypress() {
    const config = this.getEnvironmentConfig()
    const timeouts = this.getTimeouts()
    
    // Configura timeouts globalmente
    Cypress.config('defaultCommandTimeout', timeouts.medium)
    Cypress.config('requestTimeout', timeouts.long)
    Cypress.config('responseTimeout', timeouts.long)
    
    cy.log(`🌍 [ENVIRONMENT] Configurado para: ${config.name} (${config.code})`)
    cy.log(`⏱️ [TIMEOUTS] Short: ${timeouts.short}ms, Medium: ${timeouts.medium}ms, Long: ${timeouts.long}ms`)
    
    return config
  }

  /**
   * Aguarda baseado no ambiente (CI precisa de mais tempo)
   */
  static smartWait(baseTime = 1000) {
    const multiplier = this.isCI() ? 2 : 1
    const waitTime = baseTime * multiplier
    
    cy.log(`⏳ [SMART WAIT] Aguardando ${waitTime}ms (ambiente: ${this.getCurrentEnvironment()})`)
    cy.wait(waitTime)
  }

  /**
   * Executa retry inteligente baseado no ambiente
   */
  static retryOnEnvironment(callback, maxRetries = null) {
    const config = this.getEnvironmentConfig()
    const retries = maxRetries || config.retries
    
    let attempt = 0
    
    const executeWithRetry = () => {
      try {
        callback()
      } catch (error) {
        attempt++
        if (attempt < retries) {
          cy.log(`🔄 [RETRY] Tentativa ${attempt + 1}/${retries + 1}`)
          this.smartWait(1000 * attempt) // Aumenta delay progressivamente
          executeWithRetry()
        } else {
          throw error
        }
      }
    }
    
    executeWithRetry()
  }

  /**
   * Log com informações do ambiente
   */
  static logEnvironmentInfo() {
    const config = this.getEnvironmentConfig()
    const isCI = this.isCI()
    const basePath = this.getBasePath()
    
    cy.log(`🌍 [ENV INFO] Ambiente: ${config.name} (${config.code})`)
    cy.log(`🏠 [ENV INFO] Local: ${!isCI}, CI: ${isCI}`)
    cy.log(`📍 [ENV INFO] Base Path: "${basePath}"`)
    cy.log(`🔗 [ENV INFO] Base URL: ${Cypress.config('baseUrl')}`)
    cy.log(`⏱️ [ENV INFO] Timeout padrão: ${config.timeout}ms`)
  }

  /**
   * Verifica se deve executar teste específico baseado no ambiente
   */
  static shouldRunTest(environments = ['all']) {
    if (environments.includes('all')) {
      return true
    }
    
    const currentEnv = this.getCurrentEnvironment()
    return environments.includes(currentEnv)
  }

  /**
   * Pula teste se não for o ambiente correto
   */
  static skipTestIf(condition, reason = 'Teste pulado baseado no ambiente') {
    if (condition) {
      cy.log(`⏭️ [SKIP] ${reason}`)
      return true
    }
    return false
  }

  /**
   * Executa ação apenas em determinados ambientes
   */
  static runInEnvironments(environments, callback) {
    if (this.shouldRunTest(environments)) {
      callback()
    } else {
      cy.log(`⏭️ [SKIP] Ação pulada - ambiente atual: ${this.getCurrentEnvironment()}`)
    }
  }

  /**
   * Configura viewport baseado no ambiente
   */
  static setEnvironmentViewport() {
    const config = this.getEnvironmentConfig()
    
    if (this.isCI()) {
      // No CI, usa viewport maior para capturar mais conteúdo
      cy.viewport(1920, 1080)
    } else {
      // Local usa viewport padrão
      cy.viewport(1280, 720)
    }
    
    cy.log(`📺 [VIEWPORT] Configurado para ambiente: ${config.name}`)
  }
}
