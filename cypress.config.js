import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    // Configurações de timeout mais generosas para CI
    defaultCommandTimeout: process.env.CI ? 15000 : 4000,
    pageLoadTimeout: process.env.CI ? 90000 : 60000,
    requestTimeout: process.env.CI ? 10000 : 5000,
    setupNodeEvents(/* on, config */) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})

