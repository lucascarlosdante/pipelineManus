import { BasePage } from './BasePage.js'

/**
 * RegisterPage - Página de cadastro
 * Contém todos os elementos e ações relacionadas ao registro
 */
export class RegisterPage extends BasePage {
  constructor() {
    super()
    
    // Seletores centralizados
    this.selectors = {
      nameInput: '[data-testid="name-input"]',
      emailInput: '[data-testid="email-input"]',
      phoneInput: '[data-testid="phone-input"]',
      departmentSelect: '[data-testid="department-select"]',
      passwordInput: '[data-testid="password-input"]',
      confirmPasswordInput: '[data-testid="confirm-password-input"]',
      acceptTermsCheckbox: '[data-testid="accept-terms-checkbox"]',
      newsletterCheckbox: '[data-testid="newsletter-checkbox"]',
      registerButton: '[data-testid="register-button"]',
      loginLink: '[data-testid="login-link"]',
      togglePassword: '[data-testid="toggle-password"]',
      toggleConfirmPassword: '[data-testid="toggle-confirm-password"]',
      termsLink: '[data-testid="terms-link"]',
      privacyLink: '[data-testid="privacy-link"]',
      
      // Campos de erro
      nameError: '[data-testid="name-error"]',
      emailError: '[data-testid="email-error"]',
      phoneError: '[data-testid="phone-error"]',
      departmentError: '[data-testid="department-error"]',
      passwordError: '[data-testid="password-error"]',
      confirmPasswordError: '[data-testid="confirm-password-error"]',
      acceptTermsError: '[data-testid="accept-terms-error"]',
      
      // Título
      title: 'h2:contains("Criar Conta")'
    }

    // Dados padrão para testes
    this.defaultData = {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      department: 'Tecnologia da Informação',
      password: '123456',
      confirmPassword: '123456'
    }

    // Opções de departamento disponíveis
    this.departments = [
      'Tecnologia da Informação',
      'Recursos Humanos',
      'Financeiro',
      'Marketing',
      'Vendas',
      'Operações'
    ]
  }

  /**
   * Navega para a página de registro
   */
  goto() {
    this.visit('/#/register')
    this.waitForPageLoad()
    return this
  }

  /**
   * Aguarda página de registro carregar completamente
   */
  waitForPageLoad() {
    this.waitForElement(this.selectors.title)
    this.waitForElement(this.selectors.nameInput)
    this.waitForElement(this.selectors.registerButton)
    cy.log('✅ [REGISTER PAGE] Página carregada completamente')
    return this
  }

  /**
   * Preenche o campo nome
   */
  fillName(name = this.defaultData.name) {
    this.fillField(this.selectors.nameInput, name)
    return this
  }

  /**
   * Preenche o campo email
   */
  fillEmail(email = this.defaultData.email) {
    this.fillField(this.selectors.emailInput, email)
    return this
  }

  /**
   * Preenche o campo telefone
   */
  fillPhone(phone = this.defaultData.phone) {
    this.fillField(this.selectors.phoneInput, phone)
    return this
  }

  /**
   * Seleciona departamento
   */
  selectDepartment(department = this.defaultData.department) {
    this.selectOption(this.selectors.departmentSelect, department)
    return this
  }

  /**
   * Preenche o campo senha
   */
  fillPassword(password = this.defaultData.password) {
    this.fillField(this.selectors.passwordInput, password)
    return this
  }

  /**
   * Preenche o campo confirmação de senha
   */
  fillConfirmPassword(confirmPassword = this.defaultData.confirmPassword) {
    this.fillField(this.selectors.confirmPasswordInput, confirmPassword)
    return this
  }

  /**
   * Marca checkbox de aceite de termos
   */
  acceptTerms() {
    this.clickElement(this.selectors.acceptTermsCheckbox)
    return this
  }

  /**
   * Marca checkbox de newsletter (opcional)
   */
  acceptNewsletter() {
    this.clickElement(this.selectors.newsletterCheckbox)
    return this
  }

  /**
   * Clica no botão de registro
   */
  clickRegister() {
    this.clickElement(this.selectors.registerButton)
    return this
  }

  /**
   * Executa registro completo com dados padrão ou customizados
   */
  register(userData = {}) {
    const data = { ...this.defaultData, ...userData }
    
    cy.log(`👤 [REGISTER] Registrando usuário: ${data.email}`)
    
    this.fillName(data.name)
      .fillEmail(data.email)
      .fillPhone(data.phone)
      .selectDepartment(data.department)
      .fillPassword(data.password)
      .fillConfirmPassword(data.confirmPassword)
      .acceptTerms()
    
    if (data.newsletter) {
      this.acceptNewsletter()
    }
    
    this.clickRegister()
      .waitForRegisterSuccess()
    
    cy.log('✅ [REGISTER] Registro realizado com sucesso!')
    return this
  }

  /**
   * Aguarda o sucesso do registro (redirecionamento para dashboard)
   */
  waitForRegisterSuccess() {
    cy.log('⏳ [REGISTER] Aguardando redirecionamento...')
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
   * Alterna visibilidade da confirmação de senha
   */
  toggleConfirmPasswordVisibility() {
    this.clickElement(this.selectors.toggleConfirmPassword)
    return this
  }

  /**
   * Verifica que senhas estão ocultas
   */
  passwordsShouldBeHidden() {
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'password')
    cy.get(this.selectors.confirmPasswordInput).should('have.attr', 'type', 'password')
    return this
  }

  /**
   * Verifica que senhas estão visíveis
   */
  passwordsShouldBeVisible() {
    cy.get(this.selectors.passwordInput).should('have.attr', 'type', 'text')
    cy.get(this.selectors.confirmPasswordInput).should('have.attr', 'type', 'text')
    return this
  }

  /**
   * Navega para página de login
   */
  goToLogin() {
    this.clickElement(this.selectors.loginLink)
    this.shouldBeAtPath('/login')
    return this
  }

  /**
   * Verifica erros de validação específicos
   */
  shouldHaveNameError() {
    this.waitForElement(this.selectors.nameError)
    return this
  }

  shouldHaveEmailError() {
    this.waitForElement(this.selectors.emailError)
    return this
  }

  shouldHavePhoneError() {
    this.waitForElement(this.selectors.phoneError)
    return this
  }

  shouldHaveDepartmentError() {
    this.waitForElement(this.selectors.departmentError)
    return this
  }

  shouldHavePasswordError() {
    this.waitForElement(this.selectors.passwordError)
    return this
  }

  shouldHaveConfirmPasswordError() {
    this.waitForElement(this.selectors.confirmPasswordError)
    return this
  }

  shouldHaveTermsError() {
    this.waitForElement(this.selectors.acceptTermsError)
    return this
  }

  /**
   * Verifica erro específico de senhas não coincidem
   */
  shouldHavePasswordMismatchError() {
    cy.get(this.selectors.confirmPasswordError).should('contain', 'Senhas não coincidem')
    return this
  }

  /**
   * Tenta registro com dados inválidos para testar validações
   */
  registerWithInvalidData() {
    this.clickRegister()
    return this
  }

  /**
   * Preenche senhas diferentes para testar validação
   */
  fillMismatchedPasswords() {
    this.fillPassword('123456')
      .fillConfirmPassword('654321')
    return this
  }

  /**
   * Verifica todos os elementos da página estão presentes
   */
  shouldHaveAllElements() {
    cy.log('🔍 [VERIFY] Verificando todos os elementos da página de registro')
    
    const mainElements = [
      this.selectors.nameInput,
      this.selectors.emailInput,
      this.selectors.phoneInput,
      this.selectors.departmentSelect,
      this.selectors.passwordInput,
      this.selectors.confirmPasswordInput,
      this.selectors.acceptTermsCheckbox,
      this.selectors.newsletterCheckbox,
      this.selectors.registerButton,
      this.selectors.loginLink
    ]
    
    mainElements.forEach(selector => {
      this.waitForElement(selector)
    })
    
    return this
  }

  /**
   * Verifica links de termos e privacidade estão visíveis
   */
  shouldHaveTermsAndPrivacyLinks() {
    this.waitForElement(this.selectors.termsLink)
    this.waitForElement(this.selectors.privacyLink)
    return this
  }

  /**
   * Limpa todos os campos
   */
  clearAllFields() {
    cy.get(this.selectors.nameInput).clear()
    cy.get(this.selectors.emailInput).clear()
    cy.get(this.selectors.phoneInput).clear()
    cy.get(this.selectors.passwordInput).clear()
    cy.get(this.selectors.confirmPasswordInput).clear()
    return this
  }
}
