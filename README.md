# CI/CD Demo App

Uma aplicação React completa para demonstração de CI/CD com testes automatizados e deploy em múltiplos ambientes.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login e cadastro com validação
- **CRUD Completo**: Gerenciamento de itens com operações completas
- **Diferenciação Visual**: Cores e indicadores diferentes por ambiente
- **Testes E2E**: Testes automatizados com Cypress
- **CI/CD Pipeline**: Deploy automatizado via GitHub Actions
- **Múltiplos Ambientes**: dev, tst, hml, prd

## 🛠️ Tecnologias

- **Frontend**: React 19, Vite, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Formulários**: React Hook Form, Zod
- **Roteamento**: React Router DOM
- **Testes**: Cypress
- **CI/CD**: GitHub Actions
- **Deploy**: GitHub Pages

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cicd-demo-app.git
cd cicd-demo-app

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

## 🧪 Testes

### Testes End-to-End com Cypress

```bash
# Executar testes em modo headless
pnpm run test:e2e

# Abrir interface do Cypress
pnpm run test:e2e:dev

# Executar Cypress diretamente
pnpm run cypress:open
pnpm run cypress:run
```

### Cobertura de Testes

- ✅ Autenticação (login/logout)
- ✅ Cadastro de usuários
- ✅ CRUD de itens
- ✅ Busca e filtros
- ✅ Diferenciação de ambientes
- ✅ Validação de formulários

## 🌍 Ambientes

### Desenvolvimento (DEV)
- **Cor**: Verde (#10B981)
- **URL Local**: http://localhost:5173
- **Características**: Logs detalhados, hot reload

### Teste (TST)
- **Cor**: Amarelo (#F59E0B)
- **URL**: https://tst-cicd-demo.netlify.app
- **Características**: Dados de teste, debugging habilitado

### Homologação (HML)
- **Cor**: Azul (#3B82F6)
- **URL**: https://hml-cicd-demo.netlify.app
- **Características**: Ambiente similar à produção

### Produção (PRD)
- **Cor**: Vermelho (#EF4444)
- **URL**: https://seu-usuario.github.io/cicd-demo-app
- **Características**: Otimizado, analytics habilitado

## 🔄 CI/CD Pipeline

### Branches e Fluxo

```
main/prd ← hml ← tst ← dev ← feature-branches
```

### Workflows

1. **Quality Checks**: Executado em todos os pushes
   - ESLint
   - Build verification
   - Security audit
   - Bundle size check

2. **CI/CD Pipeline**: Executado por branch
   - **dev/tst**: Build + Testes E2E + Deploy staging
   - **hml**: Build + Testes + Deploy staging
   - **prd/main**: Build + Deploy produção (GitHub Pages)

### GitHub Actions

- `.github/workflows/ci-cd.yml`: Pipeline principal
- `.github/workflows/quality-checks.yml`: Verificações de qualidade

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev          # Servidor de desenvolvimento
pnpm run build        # Build para produção
pnpm run preview      # Preview do build
pnpm run lint         # Verificação de código

# Testes
pnpm run test:e2e     # Testes E2E (headless)
pnpm run test:e2e:dev # Testes E2E (interface)
pnpm run cypress:open # Abrir Cypress
pnpm run cypress:run  # Executar Cypress
```

## 🏗️ Estrutura do Projeto

```
cicd-demo-app/
├── .github/
│   └── workflows/          # GitHub Actions
├── cypress/
│   ├── e2e/               # Testes end-to-end
│   ├── fixtures/          # Dados de teste
│   └── support/           # Comandos customizados
├── public/                # Arquivos estáticos
├── src/
│   ├── components/        # Componentes React
│   │   └── ui/           # Componentes UI (shadcn/ui)
│   ├── contexts/         # Contextos React
│   ├── config/           # Configurações
│   ├── pages/            # Páginas da aplicação
│   └── lib/              # Utilitários
├── cypress.config.js     # Configuração Cypress
├── vite.config.js        # Configuração Vite
└── package.json          # Dependências e scripts
```

## 🎯 Elementos Testáveis

Todos os elementos interativos possuem `data-testid` para facilitar os testes:

- `email-input`, `password-input`: Campos de login
- `login-button`, `register-button`: Botões de ação
- `add-item-button`, `edit-item-{id}`: Ações de CRUD
- `search-input`, `priority-filter`: Filtros
- `items-table`, `item-row-{id}`: Tabela de itens

## 🚀 Deploy

### GitHub Pages (Produção)

1. Configure GitHub Pages no repositório
2. Faça push para a branch `prd` ou `main`
3. O deploy será automático via GitHub Actions

### Ambientes de Staging

Os ambientes de desenvolvimento, teste e homologação podem ser configurados com:
- Netlify
- Vercel
- Surge.sh
- Ou qualquer outro serviço de hosting

## 🔧 Configuração de Ambiente

A aplicação detecta automaticamente o ambiente baseado na URL:

```javascript
// src/config/environment.js
export const getCurrentEnvironment = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  if (pathname.includes('/dev')) return 'dev';
  if (pathname.includes('/tst')) return 'tst';
  if (pathname.includes('/hml')) return 'hml';
  if (hostname === 'localhost') return 'dev';
  
  return 'prd';
};
```

## 📝 Credenciais de Demo

Para testar a aplicação, use:
- **Email**: qualquer email válido
- **Senha**: mínimo 6 caracteres

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Objetivos do Projeto

Este projeto serve como:
- **Template**: Base para projetos React com CI/CD
- **Demonstração**: Exemplo de boas práticas de desenvolvimento
- **Aprendizado**: Referência para implementação de pipelines
- **Testes**: Ambiente para experimentar novas tecnologias

---

**Desenvolvido com ❤️ para demonstrar CI/CD com React**

