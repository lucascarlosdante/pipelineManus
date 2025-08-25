import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Viewport otimizado
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configurações de media
    video: true,
    videoCompression: 32, // Compressão mais alta para CI
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Configurações de performance
    defaultCommandTimeout: 10000, // Padrão otimizado
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    // Retry configuration
    retries: {
      runMode: 2, // CI
      openMode: 0  // Local development
    },
    
    // Configurações para evitar problemas de carregamento
    blockHosts: process.env.CI ? [
      '*googlesyndication.com', 
      '*google-analytics.com', 
      '*googletagmanager.com',
      '*hotjar.com',
      '*mixpanel.com',
      '*segment.com'
    ] : [],
    modifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false, // Para testes locais
    
    // Configuração de experimentos
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    
    setupNodeEvents(on, config) {
      // =============================================================================
      // TASKS CUSTOMIZADAS
      // =============================================================================
      
      on('task', {
        // Log estruturado para debug
        log(message) {
          const timestamp = new Date().toISOString()
          console.log(`[${timestamp}] CYPRESS:`, message)
          return null
        },
        
        // Limpa screenshots antigos
        clearScreenshots() {
          const fs = require('fs')
          const path = require('path')
          const screenshotsDir = path.join(__dirname, 'cypress/screenshots')
          
          if (fs.existsSync(screenshotsDir)) {
            fs.rmSync(screenshotsDir, { recursive: true, force: true })
            fs.mkdirSync(screenshotsDir, { recursive: true })
            console.log('📸 Screenshots folder cleared')
          }
          return null
        },
        
        // Salva métricas de performance
        saveMetrics(metrics) {
          const fs = require('fs')
          const path = require('path')
          const metricsFile = path.join(__dirname, 'cypress/reports/metrics.json')
          
          // Cria diretório se não existir
          const dir = path.dirname(metricsFile)
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }
          
          // Carrega métricas existentes ou cria novo array
          let allMetrics = []
          if (fs.existsSync(metricsFile)) {
            allMetrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'))
          }
          
          // Adiciona novas métricas
          allMetrics.push({
            timestamp: new Date().toISOString(),
            ...metrics
          })
          
          // Salva arquivo atualizado
          fs.writeFileSync(metricsFile, JSON.stringify(allMetrics, null, 2))
          console.log('📊 Metrics saved to', metricsFile)
          
          return null
        }
      })
      
      // =============================================================================
      // BROWSER LAUNCH CONFIGURATION
      // =============================================================================
      
      on('before:browser:launch', (browser, launchOptions) => {
        console.log(`🚀 Launching browser: ${browser.name} ${browser.version}`)
        
        if (browser.family === 'chromium') {
          // Chrome/Edge optimizations
          launchOptions.args.push('--disable-web-security')
          launchOptions.args.push('--disable-features=VizDisplayCompositor')
          launchOptions.args.push('--disable-dev-shm-usage') // Para CI
          launchOptions.args.push('--no-sandbox') // Para CI
          launchOptions.args.push('--disable-gpu') // Para CI
          
          // Performance flags
          launchOptions.args.push('--max_old_space_size=4096')
          launchOptions.args.push('--disable-background-timer-throttling')
          launchOptions.args.push('--disable-renderer-backgrounding')
          
          // CI specific flags
          if (process.env.CI) {
            launchOptions.args.push('--headless=new')
            launchOptions.args.push('--disable-extensions')
            launchOptions.args.push('--disable-plugins')
          }
        }
        
        return launchOptions
      })
      
      // =============================================================================
      // TEST LIFECYCLE HOOKS
      // =============================================================================
      
      on('before:run', (details) => {
        console.log('🏁 Test run starting...')
        console.log(`📊 Specs: ${details.totalTests} tests in ${details.specs.length} files`)
        console.log(`🌐 Browser: ${details.browser.name} ${details.browser.version}`)
        
        // Limpa screenshots antigos no início da execução
        return new Promise(resolve => {
          const fs = require('fs')
          const path = require('path')
          const screenshotsDir = path.join(__dirname, 'cypress/screenshots')
          
          if (fs.existsSync(screenshotsDir)) {
            fs.rmSync(screenshotsDir, { recursive: true, force: true })
            fs.mkdirSync(screenshotsDir, { recursive: true })
          }
          resolve()
        })
      })
      
      on('after:run', (results) => {
        console.log('✅ Test run completed!')
        console.log(`📊 Results: ${results.totalPassed}/${results.totalTests} passed`)
        console.log(`⏱️ Duration: ${results.totalDuration}ms`)
        
        if (results.totalFailed > 0) {
          console.log(`❌ Failed tests: ${results.totalFailed}`)
        }
        
        // Salva relatório final
        const reportData = {
          summary: {
            totalTests: results.totalTests,
            totalPassed: results.totalPassed,
            totalFailed: results.totalFailed,
            totalSkipped: results.totalSkipped,
            totalDuration: results.totalDuration
          },
          browser: results.browser,
          timestamp: new Date().toISOString(),
          environment: process.env.CI ? 'CI' : 'Local'
        }
        
        // Salva usando task (sem cy.task que não funciona no contexto Node)
        const fs = require('fs')
        const path = require('path')
        const reportsDir = path.join(__dirname, 'cypress/reports')
        
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true })
        }
        
        const reportFile = path.join(reportsDir, 'final-report.json')
        fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2))
        
        console.log(`📊 Relatório final salvo em: ${reportFile}`)
      })
      
      // =============================================================================
      // ENVIRONMENT SPECIFIC CONFIGURATION
      // =============================================================================
      
      // Detecta ambiente e ajusta configuração
      if (process.env.CI) {
        config.video = true
        config.screenshotOnRunFailure = true
        config.retries.runMode = 3
        config.defaultCommandTimeout = 15000
        console.log('🤖 CI environment detected - optimized settings applied')
      } else {
        config.video = false
        config.retries.openMode = 0
        console.log('🏠 Local environment detected - dev settings applied')
      }
      
      // Configuração baseada no browser
      if (config.browser?.name === 'electron') {
        config.chromeWebSecurity = false
        config.defaultCommandTimeout = 20000
        console.log('⚡ Electron browser detected - extended timeouts applied')
      }
      
      return config
    },
  },
  
  // =============================================================================
  // COMPONENT TESTING CONFIGURATION
  // =============================================================================
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.js',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    
    // Component specific settings
    viewportWidth: 1000,
    viewportHeight: 660,
    video: false, // Geralmente não necessário para componentes
  },
  
  // =============================================================================
  // GLOBAL CONFIGURATION
  // =============================================================================
  
  // Configurações globais que afetam ambos e2e e component
  watchForFileChanges: true,
  fileServerFolder: '.',
  fixturesFolder: 'cypress/fixtures',
  
  // Configurações de rede
  numTestsKeptInMemory: 10, // Limita uso de memória
  redirectionLimit: 20,
  
  // Configurações de logging
  trashAssetsBeforeRuns: true,
})

