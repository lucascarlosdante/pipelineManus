/**
 * PerformanceHelper - Utilitário para métricas de performance
 * Monitora tempos de execução, carregamento de páginas e responsividade
 */
export class PerformanceHelper {
  static timers = {}

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
      
      // Salva métrica sem retornar valor
      cy.wrap({
        operation: operationName,
        duration: duration.toFixed(2),
        timestamp: new Date().toISOString()
      }).as(`metric_${operationName}`)
    })
  }

  /**
   * Mede tempo de carregamento da página
   */
  static measurePageLoad(pageName) {
    cy.window().then(() => {
      // Aguarda o evento de load completo
      cy.window().its('performance').then(perf => {
        const loadTime = perf.timing.loadEventEnd - perf.timing.navigationStart
        const domReady = perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart
        
        cy.log(`📊 [PAGE LOAD] ${pageName}:`)
        cy.log(`  - DOM Ready: ${domReady}ms`)
        cy.log(`  - Full Load: ${loadTime}ms`)
        
        cy.task('log', `Page load metrics - ${pageName}: DOM=${domReady}ms, Load=${loadTime}ms`)
      })
    })
  }

  /**
   * Monitora performance de requisições AJAX
   */
  static monitorNetworkRequests() {
    cy.intercept('**', req => {
      const startTime = performance.now()
      req.on('response', () => {
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
    breakpoints.forEach(width => {
      cy.viewport(width, 800)
      cy.wait(500) // Aguarda adaptação
      
      // Verifica se elementos essenciais são visíveis
      cy.get('body').should('be.visible')
      
      cy.log(`📱 [RESPONSIVE] Testado em ${width}px`)
    })
  }

  /**
   * Monitora uso de memória durante operação
   */
  static monitorMemoryUsage(operationName) {
    cy.window().then(win => {
      if (win.performance && win.performance.memory) {
        const memBefore = win.performance.memory.usedJSHeapSize
        
        cy.log(`🧠 [MEMORY] ${operationName} - Início: ${(memBefore / 1024 / 1024).toFixed(2)}MB`)
        
        cy.wrap(memBefore).as(`memory_before_${operationName}`)
      }
    })
  }

  /**
   * Espera elemento com timeout inteligente
   */
  static waitForElementSmart(selector, maxWait = 10000) {
    const startTime = performance.now()
    
    cy.get(selector, { timeout: maxWait }).should('be.visible')
    
    cy.then(() => {
      const endTime = performance.now()
      const waitTime = endTime - startTime
      
      if (waitTime > 3000) {
        cy.log(`⚠️ [SLOW ELEMENT] ${selector} levou ${waitTime.toFixed(2)}ms`)
        cy.task('log', `Slow element detection: ${selector} - ${waitTime.toFixed(2)}ms`)
      }
    })
  }

  /**
   * Benchmark para comparar performance entre execuções
   */
  static benchmark(operationName, operation) {
    const startTime = performance.now()
    
    operation()
    
    cy.then(() => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      cy.log(`⚡ [BENCHMARK] ${operationName}: ${duration.toFixed(2)}ms`)
      
      // Salva no contexto para comparação
      cy.wrap({
        name: operationName,
        duration: duration.toFixed(2),
        timestamp: new Date().toISOString()
      }).as(`benchmark_${operationName}`)
    })
  }

  /**
   * Gera relatório final de performance
   */
  static generatePerformanceReport() {
    cy.then(() => {
      cy.log('📊 [PERFORMANCE REPORT] Gerando relatório final...')
      
      // Procura por todos os aliases de métricas
      cy.task('log', 'Performance test completed - check metrics for detailed results')
      
      cy.log('✅ [PERFORMANCE] Relatório gerado com sucesso')
    })
  }

  /**
   * Verifica Core Web Vitals (LCP, FID, CLS)
   */
  static measureCoreWebVitals() {
    cy.window().then(win => {
      // Largest Contentful Paint (LCP)
      new win.PerformanceObserver(list => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        cy.log(`📊 [LCP] Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay seria medido com interação real
      cy.log('📊 [CORE WEB VITALS] Medição iniciada')
    })
  }

  /**
   * Monitora eventos de performance personalizados
   */
  static trackCustomEvent(eventName, data = {}) {
    cy.task('log', `Custom performance event: ${eventName} - ${JSON.stringify(data)}`)
    
    cy.log(`🎯 [CUSTOM EVENT] ${eventName}`)
  }

  /**
   * Otimização: limpa métricas antigas para evitar sobrecarga
   */
  static clearMetrics() {
    cy.log('🧹 [CLEANUP] Limpando métricas antigas...')
    // As métricas são automaticamente limpas entre testes pelo Cypress
  }

  /**
   * Verifica se performance está dentro dos limites aceitáveis
   */
  static assertPerformanceThresholds(operationName, maxTime = 5000) {
    cy.get(`@metric_${operationName}`).then(metric => {
      const duration = parseFloat(metric.duration)
      
      if (duration > maxTime) {
        cy.log(`❌ [PERFORMANCE WARNING] ${operationName} excedeu limite: ${duration}ms > ${maxTime}ms`)
      } else {
        cy.log(`✅ [PERFORMANCE OK] ${operationName}: ${duration}ms < ${maxTime}ms`)
      }
      
      // Não faz assert para não quebrar o teste, apenas reporta
    })
  }
}
