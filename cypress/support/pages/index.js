/**
 * Page Objects Index - Exportação centralizada
 * 
 * Este arquivo centraliza todas as exportações de Page Objects,
 * facilitando importações e manutenção.
 */

// Base Page
export { BasePage } from './BasePage.js'

// Page Objects específicas
export { LoginPage } from './LoginPage.js'
export { RegisterPage } from './RegisterPage.js'  
export { DashboardPage } from './DashboardPage.js'

// Utility para criar todas as páginas de uma vez
export class PageFactory {
  static async createAllPages() {
    const { LoginPage } = await import('./LoginPage.js')
    const { RegisterPage } = await import('./RegisterPage.js')
    const { DashboardPage } = await import('./DashboardPage.js')
    
    return {
      loginPage: new LoginPage(),
      registerPage: new RegisterPage(),
      dashboardPage: new DashboardPage()
    }
  }
  
  static async createPage(pageName) {
    const pageMap = {
      'login': () => import('./LoginPage.js').then(m => new m.LoginPage()),
      'register': () => import('./RegisterPage.js').then(m => new m.RegisterPage()),
      'dashboard': () => import('./DashboardPage.js').then(m => new m.DashboardPage())
    }
    
    const pageCreator = pageMap[pageName.toLowerCase()]
    if (!pageCreator) {
      throw new Error(`Page '${pageName}' não encontrada`)
    }
    
    return await pageCreator()
  }
}
