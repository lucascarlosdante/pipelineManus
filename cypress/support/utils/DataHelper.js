/**
 * Data Helper - Utilitários para geração e manipulação de dados de teste
 */

export class DataHelper {
  /**
   * Gera email único baseado em timestamp
   */
  static generateUniqueEmail(prefix = 'test') {
    const timestamp = Date.now()
    return `${prefix}_${timestamp}@email.com`
  }

  /**
   * Gera nome único para testes
   */
  static generateUniqueName(prefix = 'Item') {
    const timestamp = Date.now()
    return `${prefix} ${timestamp}`
  }

  /**
   * Gera telefone brasileiro válido
   */
  static generatePhoneNumber() {
    const area = Math.floor(Math.random() * 90) + 10 // 10-99
    const number = Math.floor(Math.random() * 900000000) + 100000000 // 9 dígitos
    return `${area}9${number}`
  }

  /**
   * Gera senha segura
   */
  static generateSecurePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  /**
   * Seleciona item aleatório de uma lista
   */
  static getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Gera dados completos de usuário
   */
  static generateUserData(overrides = {}) {
    const firstName = this.getRandomItem(['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia'])
    const lastName = this.getRandomItem(['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa'])
    
    const departments = [
      'Tecnologia da Informação',
      'Recursos Humanos', 
      'Financeiro',
      'Marketing',
      'Vendas',
      'Operações'
    ]

    const defaultData = {
      name: `${firstName} ${lastName}`,
      email: this.generateUniqueEmail(firstName.toLowerCase()),
      phone: this.generatePhoneNumber(),
      department: this.getRandomItem(departments),
      password: '123456',
      confirmPassword: '123456',
      newsletter: Math.random() > 0.5
    }

    return { ...defaultData, ...overrides }
  }

  /**
   * Gera dados completos de item
   */
  static generateItemData(overrides = {}) {
    const itemTypes = ['Tarefa', 'Projeto', 'Reunião', 'Relatório', 'Análise']
    const adjectives = ['Importante', 'Urgente', 'Crítico', 'Estratégico', 'Essencial']
    
    const priorities = ['Baixa', 'Média', 'Alta']
    const categories = ['Geral', 'Trabalho', 'Pessoal', 'Projeto']

    const itemType = this.getRandomItem(itemTypes)
    const adjective = this.getRandomItem(adjectives)
    
    const defaultData = {
      name: `${adjective} ${itemType} ${Date.now()}`,
      description: `Descrição detalhada do ${itemType.toLowerCase()} ${adjective.toLowerCase()}`,
      priority: this.getRandomItem(priorities),
      category: this.getRandomItem(categories)
    }

    return { ...defaultData, ...overrides }
  }

  /**
   * Gera lista de múltiplos itens
   */
  static generateMultipleItems(count = 3, overrides = {}) {
    const items = []
    for (let i = 0; i < count; i++) {
      items.push(this.generateItemData({ 
        ...overrides,
        name: `${overrides.name || 'Item Teste'} ${i + 1}`
      }))
    }
    return items
  }

  /**
   * Valida formato de email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Valida formato de telefone brasileiro
   */
  static isValidBrazilianPhone(phone) {
    const phoneRegex = /^\d{10,11}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  /**
   * Formata CPF para testes (gera CPF válido fictício)
   */
  static generateCPF() {
    const cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
    
    // Cálculo do primeiro dígito
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += cpf[i] * (10 - i)
    }
    cpf.push((11 - (sum % 11)) % 10)
    
    // Cálculo do segundo dígito
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += cpf[i] * (11 - i)
    }
    cpf.push((11 - (sum % 11)) % 10)
    
    return cpf.join('')
  }

  /**
   * Gera dados de endereço brasileiro
   */
  static generateAddress() {
    const streets = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Av. Faria Lima']
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre']
    const states = ['SP', 'RJ', 'MG', 'RS']
    
    return {
      street: this.getRandomItem(streets),
      number: Math.floor(Math.random() * 9999) + 1,
      city: this.getRandomItem(cities),
      state: this.getRandomItem(states),
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`
    }
  }

  /**
   * Sanitiza string para uso como data-testid
   */
  static sanitizeForTestId(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim()
  }

  /**
   * Delay para simular ações humanas
   */
  static humanDelay() {
    return Math.floor(Math.random() * 500) + 100 // 100-600ms
  }

  /**
   * Cria cenário de teste com dados únicos
   */
  static createTestScenario(scenarioName, customData = {}) {
    const timestamp = Date.now()
    return {
      id: `${scenarioName}_${timestamp}`,
      timestamp,
      user: this.generateUserData(customData.user),
      items: customData.itemCount ? 
        this.generateMultipleItems(customData.itemCount, customData.itemOverrides) : 
        [this.generateItemData(customData.itemOverrides)],
      ...customData
    }
  }
}
