import { BasePage } from './BasePage.js'

/**
 * DashboardPage - Página principal com CRUD de itens
 * Contém todos os elementos e ações relacionadas ao dashboard
 */
export class DashboardPage extends BasePage {
  constructor() {
    super()
    
    // Seletores centralizados
    this.selectors = {
      // Header e navegação
      title: 'h1:contains("Dashboard")',
      logoutButton: '[data-testid="logout-button"]',
      environmentBadge: 'div:contains("Ambiente:")',
      userInfo: 'div:contains("teste")',
      
      // Tabela e itens
      itemsTable: '[data-testid="items-table"]',
      itemsCount: 'span:contains("Itens (")',
      
      // Controles de ação
      addItemButton: '[data-testid="add-item-button"]',
      searchInput: '[data-testid="search-input"]',
      priorityFilter: '[data-testid="priority-filter"]',
      bulkDeleteButton: '[data-testid="bulk-delete-button"]',
      selectAllCheckbox: '[data-testid="select-all-checkbox"]',
      
      // Modal de adicionar item
      addItemModal: '[data-testid="add-item-modal"]',
      addNameInput: '[data-testid="add-name-input"]',
      addDescriptionInput: '[data-testid="add-description-input"]',
      addPrioritySelect: '[data-testid="add-priority-select"]',
      addCategorySelect: '[data-testid="add-category-select"]',
      addSubmitButton: '[data-testid="add-submit-button"]',
      addCancelButton: '[data-testid="add-cancel-button"]',
      
      // Modal de editar item
      editItemModal: '[data-testid="edit-item-modal"]',
      editNameInput: '[data-testid="edit-name-input"]',
      editDescriptionInput: '[data-testid="edit-description-input"]',
      editPrioritySelect: '[data-testid="edit-priority-select"]',
      editCategorySelect: '[data-testid="edit-category-select"]',
      editSubmitButton: '[data-testid="edit-submit-button"]',
      editCancelButton: '[data-testid="edit-cancel-button"]',
      
      // Estados especiais
      noItemsMessage: 'div:contains("Nenhum item encontrado")',
      loadingSpinner: '[data-testid="loading-spinner"]'
    }

    // Dados padrão para novos itens
    this.defaultItemData = {
      name: 'Novo Item de Teste',
      description: 'Descrição do novo item de teste',
      priority: 'Alta',
      category: 'Trabalho'
    }

    // Prioridades disponíveis
    this.priorities = ['Baixa', 'Média', 'Alta']
    
    // Categorias disponíveis  
    this.categories = ['Geral', 'Trabalho', 'Pessoal', 'Projeto']
  }

  /**
   * Navega para o dashboard (assumindo já logado)
   */
  goto() {
    this.visit('/#/dashboard')
    this.waitForPageLoad()
    return this
  }

  /**
   * Aguarda página do dashboard carregar completamente
   */
  waitForPageLoad() {
    this.waitForElement(this.selectors.title)
    this.waitForElement(this.selectors.itemsTable)
    this.waitForLoading()
    cy.log('✅ [DASHBOARD] Página carregada completamente')
    return this
  }

  /**
   * Verifica que dashboard está carregado com itens iniciais
   */
  shouldHaveInitialItems() {
    this.shouldContainText('Dashboard')
    this.shouldContainText('Itens (3)')
    this.shouldItemExist('Item de Exemplo 1')
    this.shouldItemExist('Item de Exemplo 2')
    this.shouldItemExist('Item de Exemplo 3')
    return this
  }

  /**
   * Abre modal de adicionar item
   */
  openAddItemModal() {
    cy.log('📋 [ADD ITEM] Abrindo modal de adicionar item')
    this.clickElement(this.selectors.addItemButton)
    this.waitForElement(this.selectors.addItemModal)
    return this
  }

  /**
   * Fecha modal de adicionar item
   */
  closeAddItemModal() {
    this.clickElement(this.selectors.addCancelButton)
    this.shouldNotExist(this.selectors.addItemModal)
    return this
  }

  /**
   * Preenche dados no modal de adicionar item
   */
  fillAddItemForm(itemData = {}) {
    const data = { ...this.defaultItemData, ...itemData }
    
    cy.log(`📝 [ADD ITEM] Preenchendo formulário: ${data.name}`)
    
    this.fillField(this.selectors.addNameInput, data.name)
      .fillField(this.selectors.addDescriptionInput, data.description)
      .selectOption(this.selectors.addPrioritySelect, data.priority)
      .selectOption(this.selectors.addCategorySelect, data.category)
    
    return this
  }

  /**
   * Submete o formulário de adicionar item
   */
  submitAddItem() {
    this.clickElement(this.selectors.addSubmitButton)
    this.shouldNotExist(this.selectors.addItemModal)
    return this
  }

  /**
   * Adiciona um novo item completo
   */
  addItem(itemData = {}) {
    const data = { ...this.defaultItemData, ...itemData }
    
    cy.log(`➕ [ADD ITEM] Adicionando item: ${data.name}`)
    
    this.openAddItemModal()
      .fillAddItemForm(data)
      .submitAddItem()
      .shouldItemExist(data.name)
    
    cy.log('✅ [ADD ITEM] Item adicionado com sucesso!')
    return this
  }

  /**
   * Verifica se item existe na tabela
   */
  shouldItemExist(itemName) {
    cy.log(`✅ [VERIFY] Verificando existência do item: ${itemName}`)
    cy.get(this.selectors.itemsTable).should('contain', itemName)
    return this
  }

  /**
   * Verifica se item NÃO existe na tabela
   */
  shouldItemNotExist(itemName) {
    cy.log(`❌ [VERIFY] Verificando que item não existe: ${itemName}`)
    cy.get(this.selectors.itemsTable).should('not.contain', itemName)
    return this
  }

  /**
   * Busca por um item
   */
  searchForItem(searchTerm) {
    cy.log(`🔍 [SEARCH] Buscando por: ${searchTerm}`)
    this.fillField(this.selectors.searchInput, searchTerm)
    return this
  }

  /**
   * Filtra por prioridade
   */
  filterByPriority(priority) {
    cy.log(`🎯 [FILTER] Filtrando por prioridade: ${priority}`)
    this.selectOption(this.selectors.priorityFilter, priority)
    return this
  }

  /**
   * Seleciona um item específico
   */
  selectItem(itemId) {
    const selector = `[data-testid="select-item-${itemId}"]`
    this.clickElement(selector)
    return this
  }

  /**
   * Seleciona todos os itens
   */
  selectAllItems() {
    cy.log('☑️ [SELECT] Selecionando todos os itens')
    this.clickElement(this.selectors.selectAllCheckbox)
    return this
  }

  /**
   * Abre menu de ações de um item
   */
  openItemActions(itemId) {
    const selector = `[data-testid="item-actions-${itemId}"]`
    this.clickElement(selector)
    return this
  }

  /**
   * Edita um item específico
   */
  editItem(itemId, newData = {}) {
    cy.log(`✏️ [EDIT] Editando item ID: ${itemId}`)
    
    this.openItemActions(itemId)
    this.clickElement(`[data-testid="edit-item-${itemId}"]`)
    this.waitForElement(this.selectors.editItemModal)
    
    if (newData.name) {
      this.fillField(this.selectors.editNameInput, newData.name, { clear: true })
    }
    
    if (newData.description) {
      this.fillField(this.selectors.editDescriptionInput, newData.description, { clear: true })
    }
    
    if (newData.priority) {
      this.selectOption(this.selectors.editPrioritySelect, newData.priority)
    }
    
    if (newData.category) {
      this.selectOption(this.selectors.editCategorySelect, newData.category)
    }
    
    this.clickElement(this.selectors.editSubmitButton)
    this.shouldNotExist(this.selectors.editItemModal)
    
    if (newData.name) {
      this.shouldItemExist(newData.name)
    }
    
    cy.log('✅ [EDIT] Item editado com sucesso!')
    return this
  }

  /**
   * Deleta um item específico
   */
  deleteItem(itemId) {
    cy.log(`🗑️ [DELETE] Deletando item ID: ${itemId}`)
    
    this.openItemActions(itemId)
    this.clickElement(`[data-testid="delete-item-${itemId}"]`)
    
    cy.log('✅ [DELETE] Item deletado com sucesso!')
    return this
  }

  /**
   * Deleta itens selecionados em lote
   */
  deleteBulkItems() {
    cy.log('🗑️ [BULK DELETE] Deletando itens selecionados')
    this.clickElement(this.selectors.bulkDeleteButton)
    return this
  }

  /**
   * Alterna status de completado de um item
   */
  toggleItemComplete(itemId) {
    const selector = `[data-testid="toggle-complete-${itemId}"]`
    cy.log(`✓ [TOGGLE] Alternando status do item ID: ${itemId}`)
    this.clickElement(selector)
    return this
  }

  /**
   * Faz logout
   */
  logout() {
    cy.log('🚪 [LOGOUT] Fazendo logout do dashboard')
    this.clickElement(this.selectors.logoutButton)
    this.shouldBeAtPath('/login')
    return this
  }

  /**
   * Verifica informações do ambiente
   */
  shouldShowEnvironment(environment) {
    const envNames = {
      dev: 'Desenvolvimento',
      tst: 'Teste', 
      hml: 'Homologação',
      prd: 'Produção'
    }
    
    this.shouldContainText(`Ambiente: ${envNames[environment]}`)
    return this
  }

  /**
   * Verifica informações do usuário
   */
  shouldShowUserInfo(username = 'teste') {
    this.shouldContainText(username)
    return this
  }

  /**
   * Verifica contagem de itens
   */
  shouldHaveItemsCount(count) {
    this.shouldContainText(`Itens (${count})`)
    return this
  }

  /**
   * Verifica mensagem de nenhum item encontrado
   */
  shouldShowNoItemsMessage() {
    this.waitForElement(this.selectors.noItemsMessage)
    return this
  }

  /**
   * Verifica se botão de deletar em lote está visível com contagem
   */
  shouldShowBulkDeleteButton(count) {
    this.waitForElement(this.selectors.bulkDeleteButton)
    cy.get(this.selectors.bulkDeleteButton).should('contain', `(${count})`)
    return this
  }

  /**
   * Aguarda loading/atualização da tabela
   */
  waitForTableUpdate() {
    this.waitForLoading()
    // Aguarda um pouco para a tabela se atualizar
    this.wait(500)
    return this
  }

  /**
   * Verifica todos os elementos principais da página
   */
  shouldHaveAllMainElements() {
    cy.log('🔍 [VERIFY] Verificando todos os elementos principais do dashboard')
    
    const mainElements = [
      this.selectors.title,
      this.selectors.addItemButton,
      this.selectors.searchInput,
      this.selectors.priorityFilter,
      this.selectors.itemsTable,
      this.selectors.selectAllCheckbox
    ]
    
    mainElements.forEach(selector => {
      this.waitForElement(selector)
    })
    
    return this
  }
}
