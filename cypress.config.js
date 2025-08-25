import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true, // Habilitar vídeo para debug
    screenshotOnRunFailure: true,
    // Configurações para evitar problemas de carregamento no CI
    blockHosts: process.env.CI ? ['*googlesyndication.com', '*google-analytics.com', '*googletagmanager.com'] : [],
    modifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on /* config */) {
      // Log de debug para rastrear eventos
      on('before:browser:launch', (browser = {}, launchOptions) => {
        console.log('🚀 Lançando browser:', browser.name, browser.version)
        
        if (browser.name === 'chrome') {
          // Adicionar flags do Chrome para debug
          launchOptions.args.push('--disable-web-security')
          launchOptions.args.push('--disable-features=VizDisplayCompositor')
        }
        
        return launchOptions
      })
      
      on('task', {
        log(message) {
          console.log('📋 CYPRESS LOG:', message)
          return null
        }
      })
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})

