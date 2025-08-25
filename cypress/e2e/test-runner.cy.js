describe('Test Runner - Executa todos os testes e captura falhas', () => {
  let testResults = []
  let failures = []

  // Lista de todos os testes para executar
  const testSuites = [
    {
      name: 'Autenticação',
      file: 'auth.cy.js',
      tests: [
        'deve redirecionar para login quando não autenticado',
        'deve fazer login com credenciais válidas',
        'deve mostrar erro com credenciais inválidas',
        'deve fazer logout corretamente'
      ]
    },
    {
      name: 'Cadastro de Usuário',
      file: 'register.cy.js',
      tests: [
        'deve exibir formulário de cadastro',
        'deve cadastrar usuário com dados válidos',
        'deve validar campos obrigatórios',
        'deve validar formato do email',
        'deve validar confirmação de senha'
      ]
    },
    {
      name: 'Dashboard - CRUD de Itens',
      file: 'dashboard.cy.js',
      tests: [
        'deve exibir dashboard com itens iniciais',
        'deve adicionar novo item',
        'deve editar item existente',
        'deve excluir item',
        'deve validar campos do formulário'
      ]
    },
    {
      name: 'Diferenciação de Ambientes',
      file: 'environment.cy.js',
      tests: [
        'deve mostrar ambiente de desenvolvimento',
        'deve ter comportamento específico por ambiente',
        'deve carregar configurações do ambiente'
      ]
    }
  ]

  before(() => {
    // Limpa resultados anteriores
    testResults = []
    failures = []
  })

  testSuites.forEach((suite, suiteIndex) => {
    describe(`Executando: ${suite.name}`, () => {
      suite.tests.forEach((testName, testIndex) => {
        it(`${testName}`, () => {
          const testId = `${suite.name}-${testIndex + 1}`
          
          cy.then(() => {
            return new Cypress.Promise((resolve, reject) => {
              try {
                // Simula a execução do teste específico baseado no arquivo
                executeTestByFile(suite.file, testName)
                  .then((result) => {
                    testResults.push({
                      suite: suite.name,
                      test: testName,
                      status: 'passed',
                      duration: result.duration || 0
                    })
                    resolve(result)
                  })
                  .catch((error) => {
                    const failure = {
                      suite: suite.name,
                      test: testName,
                      status: 'failed',
                      error: error.message,
                      stack: error.stack,
                      timestamp: new Date().toISOString()
                    }
                    failures.push(failure)
                    testResults.push(failure)
                    resolve(failure) // Não rejeitamos para continuar com outros testes
                  })
              } catch (error) {
                const failure = {
                  suite: suite.name,
                  test: testName,
                  status: 'failed',
                  error: error.message,
                  stack: error.stack,
                  timestamp: new Date().toISOString()
                }
                failures.push(failure)
                testResults.push(failure)
                resolve(failure)
              }
            })
          })
        })
      })
    })
  })

  after(() => {
    // Salva os resultados em arquivo
    cy.then(() => {
      const reportContent = generateFailureReport(failures, testResults)
      
      // Escreve o relatório em arquivo usando cy.writeFile
      cy.writeFile('cypress/results/test-failures.txt', reportContent)
      
      // Log no console para debug
      if (failures.length > 0) {
        cy.log(`❌ ${failures.length} teste(s) falharam. Relatório salvo em cypress/results/test-failures.txt`)
        console.log('Falhas detectadas:', failures)
      } else {
        cy.log('✅ Todos os testes passaram!')
      }
    })
  })

  // Função auxiliar para executar teste específico de um arquivo
  function executeTestByFile(fileName, testName) {
    return new Cypress.Promise((resolve, reject) => {
      const basePath = Cypress.env('CI') ? '/pipelineManus' : ''
      
      switch (fileName) {
        case 'auth.cy.js':
          executeAuthTest(testName, basePath).then(resolve).catch(reject)
          break
        case 'register.cy.js':
          executeRegisterTest(testName, basePath).then(resolve).catch(reject)
          break
        case 'dashboard.cy.js':
          executeDashboardTest(testName, basePath).then(resolve).catch(reject)
          break
        case 'environment.cy.js':
          executeEnvironmentTest(testName, basePath).then(resolve).catch(reject)
          break
        default:
          reject(new Error(`Arquivo de teste não reconhecido: ${fileName}`))
      }
    })
  }

  // Implementações específicas de cada teste
  function executeAuthTest(testName, basePath) {
    return new Cypress.Promise((resolve, reject) => {
      const startTime = Date.now()
      
      try {
        cy.visit(`${basePath}`)
        
        switch (testName) {
          case 'deve redirecionar para login quando não autenticado':
            cy.url().should('include', '#/login')
            cy.contains('Entrar').should('be.visible')
            break
            
          case 'deve fazer login com credenciais válidas':
            cy.visit(`${basePath}/#/login`)
            cy.get('[data-testid="email-input"]').type('teste@email.com')
            cy.get('[data-testid="password-input"]').type('123456')
            cy.get('button[type="submit"]').click()
            cy.url().should('include', '#/dashboard')
            break
            
          case 'deve mostrar erro com credenciais inválidas':
            cy.visit(`${basePath}/#/login`)
            cy.get('[data-testid="email-input"]').type('email-invalido.com')
            cy.get('[data-testid="password-input"]').type('senhaerrada')
            cy.get('button[type="submit"]').click()
            cy.contains('Credenciais inválidas').should('be.visible')
            break
            
          case 'deve fazer logout corretamente':
            cy.login()
            cy.get('[data-testid="logout-button"]').click()
            cy.url().should('include', '#/login')
            break
        }
        
        resolve({ duration: Date.now() - startTime, status: 'passed' })
      } catch (error) {
        reject(error)
      }
    })
  }

  function executeRegisterTest(testName, basePath) {
    return new Cypress.Promise((resolve, reject) => {
      const startTime = Date.now()
      
      try {
        switch (testName) {
          case 'deve exibir formulário de cadastro':
            cy.visit(`${basePath}/#/register`)
            cy.contains('Criar Conta').should('be.visible')
            cy.get('[data-testid="name-input"]').should('be.visible')
            break
            
          case 'deve cadastrar usuário com dados válidos':
            cy.visit(`${basePath}/#/register`)
            cy.get('[data-testid="name-input"]').type('Usuário Teste')
            cy.get('[data-testid="email-input"]').type('novo@email.com')
            cy.get('[data-testid="phone-input"]').type('11999999999')
            cy.get('[data-testid="password-input"]').type('123456')
            cy.get('[data-testid="confirm-password-input"]').type('123456')
            cy.get('button[type="submit"]').click()
            cy.url().should('include', '#/dashboard')
            break
            
          case 'deve validar campos obrigatórios':
            cy.visit(`${basePath}/#/register`)
            cy.get('button[type="submit"]').click()
            cy.contains('Nome é obrigatório').should('be.visible')
            break
            
          case 'deve validar formato do email':
            cy.visit(`${basePath}/#/register`)
            cy.get('[data-testid="email-input"]').type('email-invalido')
            cy.get('button[type="submit"]').click()
            cy.contains('Email inválido').should('be.visible')
            break
            
          case 'deve validar confirmação de senha':
            cy.visit(`${basePath}/#/register`)
            cy.get('[data-testid="password-input"]').type('123456')
            cy.get('[data-testid="confirm-password-input"]').type('654321')
            cy.get('button[type="submit"]').click()
            cy.contains('Senhas não coincidem').should('be.visible')
            break
        }
        
        resolve({ duration: Date.now() - startTime, status: 'passed' })
      } catch (error) {
        reject(error)
      }
    })
  }

  function executeDashboardTest(testName, basePath) {
    return new Cypress.Promise((resolve, reject) => {
      const startTime = Date.now()
      
      try {
        // Dashboard sempre precisa de login primeiro
        cy.login()
        
        switch (testName) {
          case 'deve exibir dashboard com itens iniciais':
            cy.contains('Dashboard').should('be.visible')
            cy.contains('Itens (3)').should('be.visible')
            cy.get('[data-testid="items-table"]').should('be.visible')
            break
            
          case 'deve adicionar novo item':
            cy.get('[data-testid="add-item-button"]').click()
            cy.get('[data-testid="item-name-input"]').type('Novo Item Teste')
            cy.get('[data-testid="item-description-input"]').type('Descrição do item teste')
            cy.get('[data-testid="save-item-button"]').click()
            cy.contains('Novo Item Teste').should('be.visible')
            break
            
          case 'deve editar item existente':
            cy.get('[data-testid="edit-item-button"]').first().click()
            cy.get('[data-testid="item-name-input"]').clear().type('Item Editado')
            cy.get('[data-testid="save-item-button"]').click()
            cy.contains('Item Editado').should('be.visible')
            break
            
          case 'deve excluir item':
            cy.get('[data-testid="delete-item-button"]').first().click()
            cy.get('[data-testid="confirm-delete-button"]').click()
            cy.contains('Item excluído com sucesso').should('be.visible')
            break
            
          case 'deve validar campos do formulário':
            cy.get('[data-testid="add-item-button"]').click()
            cy.get('[data-testid="save-item-button"]').click()
            cy.contains('Nome é obrigatório').should('be.visible')
            break
        }
        
        resolve({ duration: Date.now() - startTime, status: 'passed' })
      } catch (error) {
        reject(error)
      }
    })
  }

  function executeEnvironmentTest(testName, basePath) {
    return new Cypress.Promise((resolve, reject) => {
      const startTime = Date.now()
      
      try {
        switch (testName) {
          case 'deve mostrar ambiente de desenvolvimento':
            cy.visit(`${basePath}`)
            cy.checkEnvironment('dev')
            cy.get('div').contains('Ambiente: Desenvolvimento').should('be.visible')
            cy.get('div').contains('(DEV)').should('be.visible')
            break
            
          case 'deve ter comportamento específico por ambiente':
            cy.visit(`${basePath}`)
            cy.window().then((win) => {
              expect(win.APP_CONFIG?.environment).to.equal('development')
            })
            break
            
          case 'deve carregar configurações do ambiente':
            cy.visit(`${basePath}`)
            cy.window().its('APP_CONFIG').should('exist')
            cy.window().its('APP_CONFIG.environment').should('not.be.undefined')
            break
        }
        
        resolve({ duration: Date.now() - startTime, status: 'passed' })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Função para gerar o relatório de falhas
  function generateFailureReport(failures, allResults) {
    const timestamp = new Date().toISOString()
    let report = `RELATÓRIO DE TESTES - FALHAS APENAS\n`
    report += `===========================================\n`
    report += `Data/Hora: ${timestamp}\n`
    report += `Total de testes executados: ${allResults.length}\n`
    report += `Testes que falharam: ${failures.length}\n`
    report += `Taxa de sucesso: ${((allResults.length - failures.length) / allResults.length * 100).toFixed(1)}%\n\n`

    if (failures.length === 0) {
      report += `✅ TODOS OS TESTES PASSARAM!\n`
      report += `Parabéns! Nenhuma falha foi detectada.\n`
    } else {
      report += `❌ FALHAS DETECTADAS:\n`
      report += `=====================\n\n`
      
      failures.forEach((failure, index) => {
        report += `${index + 1}. FALHA EM: ${failure.suite} - ${failure.test}\n`
        report += `   Status: ${failure.status}\n`
        report += `   Timestamp: ${failure.timestamp}\n`
        report += `   Erro: ${failure.error}\n`
        if (failure.stack) {
          report += `   Stack Trace:\n`
          report += `   ${failure.stack.split('\n').join('\n   ')}\n`
        }
        report += `   ${'-'.repeat(80)}\n\n`
      })
    }

    report += `\nRESUMO POR SUITE:\n`
    report += `================\n`
    
    const suiteStats = {}
    allResults.forEach(result => {
      if (!suiteStats[result.suite]) {
        suiteStats[result.suite] = { total: 0, passed: 0, failed: 0 }
      }
      suiteStats[result.suite].total++
      if (result.status === 'passed') {
        suiteStats[result.suite].passed++
      } else {
        suiteStats[result.suite].failed++
      }
    })

    Object.entries(suiteStats).forEach(([suite, stats]) => {
      const successRate = (stats.passed / stats.total * 100).toFixed(1)
      report += `${suite}:\n`
      report += `  Total: ${stats.total} | Passou: ${stats.passed} | Falhou: ${stats.failed} | Taxa: ${successRate}%\n\n`
    })

    return report
  }
})
