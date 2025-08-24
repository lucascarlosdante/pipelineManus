# 🚀 Guia de Uso - CI/CD Demo App

## Acesso Rápido

### Credenciais de Teste
- **Email**: qualquer email válido (ex: teste@email.com)
- **Senha**: mínimo 6 caracteres (ex: 123456)

## Funcionalidades Principais

### 1. Autenticação
- **Login**: Tela inicial com validação de formulário
- **Cadastro**: Formulário completo com validações
- **Logout**: Botão no header do dashboard

### 2. Dashboard - CRUD de Itens
- **Visualizar**: Tabela com todos os itens
- **Adicionar**: Botão "Adicionar Item" abre modal
- **Editar**: Menu de ações (⋯) em cada item
- **Excluir**: Individual ou em lote (seleção múltipla)
- **Buscar**: Campo de busca por nome/descrição
- **Filtrar**: Dropdown de prioridade

### 3. Elementos Testáveis
Todos os elementos possuem `data-testid` para testes automatizados:
- Campos de formulário
- Botões de ação
- Tabelas e linhas
- Modais e dropdowns

### 4. Diferenciação de Ambientes
- **DEV**: Verde - Desenvolvimento
- **TST**: Amarelo - Teste
- **HML**: Azul - Homologação
- **PRD**: Vermelho - Produção

## Comandos de Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm run dev

# Build
pnpm run build

# Testes E2E
pnpm run test:e2e

# Linting
pnpm run lint
```

## Estrutura de Testes

### Cypress E2E
- `cypress/e2e/auth.cy.js` - Testes de autenticação
- `cypress/e2e/register.cy.js` - Testes de cadastro
- `cypress/e2e/dashboard.cy.js` - Testes de CRUD
- `cypress/e2e/environment.cy.js` - Testes de ambiente

### Comandos Customizados
- `cy.login()` - Fazer login automaticamente
- `cy.logout()` - Fazer logout
- `cy.addItem()` - Adicionar item
- `cy.checkEnvironment()` - Verificar ambiente

## CI/CD Pipeline

### Branches
- `dev` → Desenvolvimento (testes + deploy staging)
- `tst` → Teste (testes + deploy staging)
- `hml` → Homologação (testes + deploy staging)
- `prd/main` → Produção (deploy GitHub Pages)

### Workflows
1. **Quality Checks**: ESLint, build, audit
2. **CI/CD Pipeline**: Testes E2E + deploy por ambiente

## Deploy

### GitHub Pages
1. Configure GitHub Pages no repositório
2. Push para branch `prd` ou `main`
3. Deploy automático via GitHub Actions

### Outros Serviços
- Netlify: `netlify deploy --dir=dist`
- Vercel: `vercel --prod`
- Surge: `surge dist/`

## Tecnologias Utilizadas

- **React 19** + **Vite** - Base da aplicação
- **Tailwind CSS** + **shadcn/ui** - Interface
- **React Hook Form** + **Zod** - Formulários
- **React Router DOM** - Roteamento
- **Cypress** - Testes E2E
- **GitHub Actions** - CI/CD

## Próximos Passos

1. **Personalização**: Adapte cores, textos e funcionalidades
2. **Backend**: Integre com API real
3. **Autenticação**: Implemente JWT ou OAuth
4. **Persistência**: Adicione banco de dados
5. **Monitoramento**: Configure analytics e logs

## Suporte

Para dúvidas ou problemas:
1. Verifique o README.md
2. Execute os testes localmente
3. Consulte a documentação do Cypress
4. Verifique os logs do GitHub Actions

---

**Desenvolvido para demonstrar CI/CD com React** 🚀

