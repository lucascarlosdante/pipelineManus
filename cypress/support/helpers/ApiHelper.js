/**
 * API Helper - Utilitários para testes de API e interceptação de requests
 */

export class ApiHelper {
  /**
   * Configura interceptações comuns para a aplicação
   */
  static setupCommonInterceptions() {
    // Mock de API de autenticação
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          id: 1,
          name: 'Usuário Teste',
          email: 'teste@email.com'
        },
        token: 'fake-jwt-token'
      }
    }).as('loginRequest')

    // Mock de API de registro
    cy.intercept('POST', '**/auth/register', {
      statusCode: 201,
      body: {
        success: true,
        user: {
          id: 2,
          name: 'Novo Usuário',
          email: 'novo@email.com'
        },
        token: 'fake-jwt-token'
      }
    }).as('registerRequest')

    // Mock de API de itens - GET
    cy.intercept('GET', '**/items', {
      statusCode: 200,
      body: {
        items: [
          {
            id: 1,
            name: 'Item de Exemplo 1',
            description: 'Primeira tarefa de exemplo',
            priority: 'medium',
            category: 'trabalho',
            completed: false,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Item de Exemplo 2',
            description: 'Segunda tarefa de exemplo',
            priority: 'high',
            category: 'projeto',
            completed: true,
            createdAt: '2024-01-02T00:00:00Z'
          },
          {
            id: 3,
            name: 'Item de Exemplo 3',
            description: 'Terceira tarefa de exemplo',
            priority: 'low',
            category: 'pessoal',
            completed: false,
            createdAt: '2024-01-03T00:00:00Z'
          }
        ],
        total: 3
      }
    }).as('getItemsRequest')

    // Mock de API de itens - POST
    cy.intercept('POST', '**/items', req => {
      const newItem = {
        id: Date.now(),
        ...req.body,
        completed: false,
        createdAt: new Date().toISOString()
      }

      return {
        statusCode: 201,
        body: {
          success: true,
          item: newItem
        }
      }
    }).as('createItemRequest')

    // Mock de API de itens - PUT
    cy.intercept('PUT', '**/items/*', req => {
      const itemId = req.url.split('/').pop()
      const updatedItem = {
        id: parseInt(itemId),
        ...req.body,
        updatedAt: new Date().toISOString()
      }

      return {
        statusCode: 200,
        body: {
          success: true,
          item: updatedItem
        }
      }
    }).as('updateItemRequest')

    // Mock de API de itens - DELETE
    cy.intercept('DELETE', '**/items/*', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Item deletado com sucesso'
      }
    }).as('deleteItemRequest')

    cy.log('✅ [API MOCK] Interceptações configuradas')
  }

  /**
   * Configura mock de API com delay para simular latência
   */
  static setupSlowApiMocks(delay = 1000) {
    cy.intercept('POST', '**/auth/login', req => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            statusCode: 200,
            body: { success: true, token: 'slow-token' }
          })
        }, delay)
      })
    }).as('slowLoginRequest')

    cy.log(`🐌 [API SLOW] Mock configurado com delay de ${delay}ms`)
  }

  /**
   * Configura mock de erro de API
   */
  static setupErrorApiMocks() {
    // Login com erro
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      }
    }).as('errorLoginRequest')

    // Erro de servidor
    cy.intercept('GET', '**/items', {
      statusCode: 500,
      body: {
        error: 'Erro interno do servidor',
        message: 'Falha ao carregar itens'
      }
    }).as('errorItemsRequest')

    // Erro de rede
    cy.intercept('POST', '**/items', { forceNetworkError: true }).as('networkErrorRequest')

    cy.log('❌ [API ERROR] Mocks de erro configurados')
  }

  /**
   * Aguarda request específico com timeout
   */
  static waitForRequest(alias, timeout = 10000) {
    cy.log(`⏳ [API WAIT] Aguardando request: ${alias}`)
    
    cy.wait(`@${alias}`, { timeout }).then(interception => {
      cy.log(`✅ [API WAIT] Request recebido: ${alias}`)
      return interception
    })
  }

  /**
   * Verifica que request foi feito com dados corretos
   */
  static verifyRequestData(alias, expectedData) {
    cy.get(`@${alias}`).then(interception => {
      cy.log(`🔍 [API VERIFY] Verificando dados do request: ${alias}`)
      
      expect(interception.request.body).to.deep.include(expectedData)
      cy.log(`✅ [API VERIFY] Dados válidos: ${alias}`)
    })
  }

  /**
   * Verifica response status e dados
   */
  static verifyResponse(alias, expectedStatus = 200, expectedData = null) {
    cy.get(`@${alias}`).then(interception => {
      expect(interception.response.statusCode).to.eq(expectedStatus)
      
      if (expectedData) {
        expect(interception.response.body).to.deep.include(expectedData)
      }
      
      cy.log(`✅ [API VERIFY] Response válido: ${alias} (${expectedStatus})`)
    })
  }

  /**
   * Simula timeout de request
   */
  static setupTimeoutMock(url, timeout = 30000) {
    cy.intercept(url, req => {
      return new Promise(() => {
        // Never resolves, causing timeout
      })
    }).as('timeoutRequest')

    cy.log(`⏰ [API TIMEOUT] Mock de timeout configurado: ${url}`)
  }

  /**
   * Monitora performance de todas as requests
   */
  static monitorApiPerformance() {
    const requestTimes = {}

    cy.intercept('**', req => {
      const requestId = `${req.method}_${req.url}`
      requestTimes[requestId] = performance.now()

      req.on('response', res => {
        const duration = performance.now() - requestTimes[requestId]
        
        if (duration > 2000) {
          cy.log(`🐌 [API SLOW] ${req.method} ${req.url}: ${duration.toFixed(2)}ms`)
        } else if (duration > 1000) {
          cy.log(`⚠️ [API WARN] ${req.method} ${req.url}: ${duration.toFixed(2)}ms`)
        }
        
        // Log apenas requests significativos
        if (duration > 500) {
          cy.task('log', `API Performance: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`)
        }
      })
    })

    cy.log('📊 [API MONITOR] Monitoramento de performance ativado')
  }

  /**
   * Configura mock baseado em fixtures
   */
  static setupFixtureMocks() {
    // Users
    cy.fixture('users').then(users => {
      cy.intercept('POST', '**/auth/login', req => {
        const { email, password } = req.body
        const user = Object.values(users).find(u => 
          u.email === email && u.password === password
        )

        if (user) {
          return {
            statusCode: 200,
            body: {
              success: true,
              user: { ...user, id: Date.now() },
              token: 'fixture-token'
            }
          }
        } else {
          return {
            statusCode: 401,
            body: { error: 'Credenciais inválidas' }
          }
        }
      }).as('fixtureLoginRequest')
    })

    // Items
    cy.fixture('items').then(items => {
      cy.intercept('GET', '**/items', {
        statusCode: 200,
        body: {
          items: items.defaultItems,
          total: items.defaultItems.length
        }
      }).as('fixtureItemsRequest')
    })

    cy.log('📁 [API FIXTURE] Mocks baseados em fixtures configurados')
  }

  /**
   * Testa conectividade com APIs reais (quando disponível)
   */
  static testRealApiConnectivity(baseUrl) {
    const endpoints = [
      { method: 'GET', path: '/health' },
      { method: 'GET', path: '/api/status' }
    ]

    endpoints.forEach(endpoint => {
      cy.request({
        method: endpoint.method,
        url: `${baseUrl}${endpoint.path}`,
        failOnStatusCode: false,
        timeout: 5000
      }).then(response => {
        cy.log(`🌐 [API HEALTH] ${endpoint.method} ${endpoint.path}: ${response.status}`)
      })
    })
  }

  /**
   * Configura retry automático para requests falhando
   */
  static setupRetryInterception(url, maxRetries = 3) {
    let attemptCount = 0

    cy.intercept(url, req => {
      attemptCount++
      
      if (attemptCount <= maxRetries && Math.random() < 0.3) {
        // 30% chance de falhar nas primeiras tentativas
        return {
          statusCode: 500,
          body: { error: 'Erro temporário' }
        }
      }

      return {
        statusCode: 200,
        body: { success: true, attempt: attemptCount }
      }
    }).as('retryRequest')

    cy.log(`🔄 [API RETRY] Configurado retry para: ${url} (max: ${maxRetries})`)
  }

  /**
   * Valida headers de security
   */
  static verifySecurityHeaders(alias) {
    cy.get(`@${alias}`).then(interception => {
      const headers = interception.response.headers
      
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options', 
        'x-xss-protection'
      ]

      securityHeaders.forEach(header => {
        if (headers[header]) {
          cy.log(`✅ [SECURITY] Header presente: ${header}`)
        } else {
          cy.log(`⚠️ [SECURITY] Header ausente: ${header}`)
        }
      })
    })
  }

  /**
   * Simula diferentes estados de conexão
   */
  static simulateConnectionStates() {
    // Offline
    cy.intercept('**', { forceNetworkError: true }).as('offlineState')
    cy.log('📵 [NETWORK] Estado offline simulado')
    
    // Volta online após delay
    cy.wait(2000).then(() => {
      this.setupCommonInterceptions()
      cy.log('📶 [NETWORK] Estado online restaurado')
    })
  }
}
