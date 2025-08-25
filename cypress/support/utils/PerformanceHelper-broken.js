/**
 * Performance Helper - Utilitários para monitoramento de performance e otimização de testes
 */

export class PerformanceHelper {
  constructor() {
    this.startTimes = new Map()
    this.metrics = []
  }

  /**
   * Inicia medição de tempo para uma operação
   */
  static startTimer(operationName) {
    const startTime = performance.now()
    cy.log(`⏱️ [TIMER START] ${operationName}`)
    
    cy.task('log', `Timer started: ${operationName} at ${new Date().toISOString()}`)
    
    // Salva no contexto do Cypress
    cy.wrap(startTime).as(`timer_${operationName}`)
    
    return startTime
  }

  /**
   * Para medição e registra resultado
   */
  static endTimer(operationName, logResult = true) {
    cy.get(`@timer_${operationName}`).then(startTime => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (logResult) {
        cy.log(`⏱️ [TIMER END] ${operationName}: ${duration.toFixed(2)}ms`)
      }
      
      cy.task('log', `Timer ended: ${operationName} - Duration: ${duration.toFixed(2)}ms`)
      
      // Salva métrica
      cy.wrap({
        operation: operationName,
        duration: duration,
        timestamp: new Date().toISOString()
      }).as(`metric_${operationName}`)
    })
  }
      cy.wrap({
        operation: operationName,
        startTime,
        endTime, 
        duration: duration.toFixed(2)
      }).as(`metric_${operationName}`)
      
      return duration
    })
  }

  /**
   * Mede tempo de carregamento da página
   */
  static measurePageLoad(pageName) {
    cy.window().then(win => {
      // Aguarda o evento de load completo
      cy.window().its('performance').then(perf => {
        const loadTime = perf.timing.loadEventEnd - perf.timing.navigationStart
        const domReady = perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart
        
        cy.log(`📊 [PAGE LOAD] ${pageName}:`)
        cy.log(`  - DOM Ready: ${domReady}ms`)
        cy.log(`  - Full Load: ${loadTime}ms`)
        
        cy.task('log', `Page load metrics - ${pageName}: DOM=${domReady}ms, Load=${loadTime}ms`)
        
        // Salva métricas
        cy.wrap({
          page: pageName,
          domReady,
          fullLoad: loadTime,
          timestamp: new Date().toISOString()
        }).as(`pageMetrics_${pageName}`)
      })
    })
  }

  /**
   * Monitora performance de requisições AJAX
   */
  static monitorNetworkRequests() {
    cy.intercept('**', req => {
      const startTime = performance.now()
      req.on('response', res => {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        if (duration > 1000) { // Log requisições > 1s
          cy.log(`🌐 [SLOW REQUEST] ${req.method} ${req.url}: ${duration.toFixed(2)}ms`)
          cy.task('log', `Slow request: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`)
        }
      })
    })
  }

  /**
   * Verifica se página está responsiva
   */
  static checkResponsiveness(breakpoints = [320, 768, 1024, 1440]) {
    const checks = breakpoints.map(width => {
      return new Promise(resolve => {
        cy.viewport(width, 800)
        cy.wait(500) // Aguarda reflow
        
        cy.document().then(doc => {
          const hasHorizontalScroll = doc.documentElement.scrollWidth > doc.documentElement.clientWidth
          
          cy.log(`📱 [RESPONSIVE] ${width}px - Scroll horizontal: ${hasHorizontalScroll ? 'Sim' : 'Não'}`)
          
          resolve({
            width,
            hasHorizontalScroll,
            viewportHeight: doc.documentElement.clientHeight
          })
        })
      })
    })
    
    return Promise.all(checks)
  }

  /**
   * Monitora uso de memória (experimental)
   */
  static monitorMemoryUsage(operationName) {
    cy.window().then(win => {
      if (win.performance && win.performance.memory) {
        const memory = win.performance.memory
        const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
        const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
        
        cy.log(`🧠 [MEMORY] ${operationName}: ${usedMB}MB / ${totalMB}MB`)
        cy.task('log', `Memory usage - ${operationName}: ${usedMB}MB/${totalMB}MB`)
      }
    })
  }

  /**
   * Aguarda elemento com timeout otimizado baseado em performance
   */
  static waitForElementSmart(selector, maxWait = 10000) {
    const startTime = performance.now()
    
    const checkElement = () => {
      return cy.get('body').then($body => {
        const element = $body.find(selector)
        const currentTime = performance.now()
        const elapsed = currentTime - startTime
        
        if (element.length > 0) {
          cy.log(`✅ [SMART WAIT] Elemento encontrado em ${elapsed.toFixed(2)}ms: ${selector}`)
          return cy.wrap(element)
        } else if (elapsed < maxWait) {
          cy.wait(100)
          return checkElement()
        } else {
          throw new Error(`Elemento não encontrado após ${elapsed.toFixed(2)}ms: ${selector}`)
        }
      })
    }
    
    return checkElement()
  }

  /**
   * Executa ação com retry baseado em performance
   */
  static retryWithBackoff(action, maxRetries = 3, baseDelay = 1000) {
    let attempt = 0
    
    const executeWithRetry = () => {
      try {
        const startTime = performance.now()
        action()
        const endTime = performance.now()
        
        cy.log(`✅ [RETRY SUCCESS] Sucesso na tentativa ${attempt + 1}: ${(endTime - startTime).toFixed(2)}ms`)
        
      } catch (error) {
        attempt++
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
          
          cy.log(`🔄 [RETRY] Tentativa ${attempt}/${maxRetries} falhou, aguardando ${delay}ms`)
          cy.wait(delay)
          executeWithRetry()
        } else {
          cy.log(`❌ [RETRY FAILED] Todas as ${maxRetries} tentativas falharam`)
          throw error
        }
      }
    }
    
    executeWithRetry()
  }

  /**
   * Gera relatório de performance
   */
  static generatePerformanceReport() {
    cy.task('log', '📊 [PERFORMANCE REPORT] Gerando relatório...')
    
    // Coleta todas as métricas salvas
    cy.window().then(() => {
      const report = {
        timestamp: new Date().toISOString(),
        environment: Cypress.env('CI') ? 'CI' : 'Local',
        browser: Cypress.browser.name,
        viewport: `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`,
        testFile: Cypress.spec.name
      }
      
      cy.task('log', JSON.stringify(report, null, 2))
    })
  }

  /**
   * Verifica Core Web Vitals (experimental)
   */
  static checkWebVitals() {
    cy.window().then(win => {
      // Simulação de Web Vitals - em aplicação real usaria biblioteca web-vitals
      cy.document().then(doc => {
        const observer = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            if (entry.entryType === 'paint') {
              cy.log(`🎨 [WEB VITALS] ${entry.name}: ${entry.startTime.toFixed(2)}ms`)
            }
          })
        })
        
        try {
          observer.observe({ entryTypes: ['paint', 'navigation'] })
          
          // Para after some time
          setTimeout(() => observer.disconnect(), 5000)
        } catch (e) {
          cy.log('⚠️ [WEB VITALS] Performance Observer não suportado')
        }
      })
    })
  }

  /**
   * Otimiza screenshots baseado em performance
   */
  static smartScreenshot(name, options = {}) {
    const startTime = performance.now()
    
    // Screenshot otimizado
    cy.screenshot(name, {
      capture: 'viewport', // Apenas viewport para ser mais rápido
      blackout: [
        '[data-testid*="sensitive"]', // Bloqueia dados sensíveis
        '.loading-spinner'
      ],
      ...options
    }).then(() => {
      const duration = performance.now() - startTime
      cy.log(`📸 [SCREENSHOT] ${name}: ${duration.toFixed(2)}ms`)
    })
  }

  /**
   * Executa teste com monitoramento completo de performance
   */
  static wrapTestWithPerformanceMonitoring(testName, testFunction) {
    const startTime = performance.now()
    
    cy.log(`🚀 [TEST START] ${testName}`)
    
    // Configura monitoramento
    this.monitorNetworkRequests()
    this.monitorMemoryUsage(`Test: ${testName}`)
    
    // Executa teste
    testFunction()
    
    // Finaliza monitoramento
    cy.then(() => {
      const endTime = performance.now()
      const totalDuration = endTime - startTime
      
      cy.log(`🏁 [TEST END] ${testName}: ${totalDuration.toFixed(2)}ms`)
      cy.task('log', `Test completed: ${testName} - Total time: ${totalDuration.toFixed(2)}ms`)
    })
  }
}
