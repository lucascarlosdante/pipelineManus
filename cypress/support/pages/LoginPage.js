import { BasePage } from './BasePage.js'

/**
 * LoginPage - Página de autenticação
 * Contém todos os elementos e ações relacionadas ao login
 */
export class LoginPage extends BasePage {
  constructor() {
    super()
    
    // Seletores centralizados
    this.selectors = {
      emailInput: '[data-testid="email-input"]',
      passwordInput: '[data-testid="password-input"]',
      loginButton: '[data-testid="login-button"]',
      togglePassword: '[data-testid="toggle-password"]',
      registerLink: '[data-testid="register-link"]',
      emailError: '[data-testid="email-error"]',
      passwordError: '[data-testid="password-error"]',
      title: ':contains("Entrar")',
      forgotPasswordLink: '[data-testid="forgot-password-link"]'
    }

    // Dados padrão
    this.defaultCredentials = {
      email: 'teste@email.com',
      password: '123456'
    }
  }

  /**
   * Navega para a página de login
   */
  goto() {
    this.visit('/#/login')
    this.waitForPageLoad()
    return this
  }

  /**
   * Aguarda página de login carregar completamente
   */
  waitForPageLoad() {
    this.waitForElement(this.selectors.title)
    this.waitForElement(this.selectors.emailInput)
    this.waitForElement(this.selectors.passwordInput)
    this.waitForElement(this.selectors.loginButton)
    cy.log('✅ [LOGIN PAGE] Página carregada completamente')
    return this
  }

  /**
   * Preenche o campo de email
   */
  fillEmail(email = this.defaultCredentials.email) {
    this.fillField(this.selectors.emailInput, email)
    return this
  }

  /**
   * Preenche o campo de senha
   */
  fillPassword(password = this.defaultCredentials.password) {
    this.fillField(this.selectors.passwordInput, password)
    return this
  }

  /**
   * Clica no botão de login
   */
  clickLogin() {
    this.clickElement(this.selectors.loginButton)
    return this
  }

  /**
   * Executa login completo com credenciais padrão ou customizadas
   */
  login(email = this.defaultCredentials.email, password = this.defaultCredentials.password) {
    cy.log(`🔐 [LOGIN] Fazendo login com: ${email}`)
    
    this.fillEmail(email)
      .fillPassword(password)
      .clickLogin()
      .waitForLoginSuccess()
    
    cy.log('✅ [LOGIN] Login realizado com sucesso!')
    return this
  }

  /**
   * Aguarda o sucesso do login (redirecionamento para dashboard)
   */
  waitForLoginSuccess() {
    cy.log('⏳ [LOGIN] Aguardando redirecionamento...')
    this.shouldBeAtPath('/dashboard')
    this.shouldContainText('Dashboard')
    return this
  }

  /**
   * Alterna visibilidade da senha
   */
  togglePasswordVisibility() {
    this.clickElement(this.selectors.togglePassword)
    return this
  }

  /**
   * Verifica que senha está oculta
   */
  passwordShouldBeHidden() {
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'password')
    return this
  }

  /**
   * Verifica que senha está visível
   */
  passwordShouldBeVisible() {
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'text')
    return this
  }

  /**
   * Navega para página de registro
   */
  goToRegister() {
    this.clickElement(this.selectors.registerLink)
    this.shouldBeAtPath('/register')
    return this
  }

  /**
   * Verifica erros de validação
   */
  shouldHaveEmailError() {
    this.waitForElement(this.selectors.emailError)
    return this
  }

  shouldHavePasswordError() {
    this.waitForElement(this.selectors.passwordError)
    return this
  }

  /**
   * Tenta login com dados inválidos
   */
  loginWithInvalidData(email = 'invalid@email', password = '123') {
    this.fillEmail(email)
      .fillPassword(password)
      .clickLogin()
    return this
  }

  /**
   * Verifica todos os elementos da página estão presentes
   */
  shouldHaveAllElements() {
    cy.log('🔍 [VERIFY] Verificando todos os elementos da página de login')
    
    Object.values(this.selectors).forEach(selector => {
      this.waitForElement(selector)
    })
    
    return this
  }

  /**
   * Limpa todos os campos
   */
  clearAllFields() {
    cy.get(this.selectors.emailInput).clear()
    cy.get(this.selectors.passwordInput).clear()
    return this
  }
}
