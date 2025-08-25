# Test Runner - Execução Encadeada de Testes

Este arquivo implementa um test runner customizado que executa todos os testes do projeto de forma encadeada e captura apenas as falhas em um arquivo de texto único.

## Como usar

### 1. Via linha de comando:
```bash
# Executar o test runner (modo headless)
npm run test:runner

# Ou usando pnpm
pnpm run test:runner

# Executar e mostrar mensagem sobre o relatório
npm run test:failures
```

### 2. Via interface gráfica:
```bash
# Abrir o Cypress com apenas o test runner
npm run test:runner:open
```

### 3. Via Cypress normal:
```bash
# Abrir o Cypress e selecionar manualmente o arquivo test-runner.cy.js
npx cypress open
```

## O que o Test Runner faz

1. **Executa todos os testes** de forma sequencial:
   - Testes de Autenticação (`auth.cy.js`)
   - Testes de Cadastro (`register.cy.js`) 
   - Testes de Dashboard/CRUD (`dashboard.cy.js`)
   - Testes de Ambiente (`environment.cy.js`)

2. **Captura falhas detalhadas**:
   - Nome do teste que falhou
   - Suite (grupo) do teste
   - Mensagem de erro
   - Stack trace completo
   - Timestamp da falha

3. **Gera relatório em arquivo texto**:
   - Salvo em: `cypress/results/test-failures.txt`
   - Contém apenas as falhas (não os sucessos)
   - Estatísticas resumidas por suite
   - Taxa de sucesso geral

## Estrutura do Relatório

O arquivo `test-failures.txt` contém:

```
RELATÓRIO DE TESTES - FALHAS APENAS
===========================================
Data/Hora: 2025-08-24T10:30:00.000Z
Total de testes executados: 17
Testes que falharam: 2
Taxa de sucesso: 88.2%

❌ FALHAS DETECTADAS:
=====================

1. FALHA EM: Autenticação - deve fazer login com credenciais válidas
   Status: failed
   Timestamp: 2025-08-24T10:30:15.123Z
   Erro: Timed out retrying after 4000ms: Expected to find element: [data-testid="email-input"], but never found it.
   Stack Trace:
   at Context.eval (webpack:///./cypress/e2e/test-runner.cy.js:...)
   ...

RESUMO POR SUITE:
================
Autenticação:
  Total: 4 | Passou: 3 | Falhou: 1 | Taxa: 75.0%

Cadastro de Usuário:
  Total: 5 | Passou: 4 | Falhou: 1 | Taxa: 80.0%
...
```

## Configuração Ambiente

O test runner detecta automaticamente o ambiente:
- **Local**: Usa `http://localhost:5173` (servidor dev do Vite)
- **CI**: Usa `http://localhost:4173` (servidor de preview)

## Customização

Para adicionar novos testes ao runner, edite o array `testSuites` no arquivo `test-runner.cy.js`:

```javascript
const testSuites = [
  {
    name: 'Nome da Suite',
    file: 'arquivo.cy.js',
    tests: [
      'nome do teste 1',
      'nome do teste 2'
    ]
  }
]
```

E implemente a função correspondente `executeXxxTest()`.

## Vantagens

1. **Execução única**: Roda todos os testes de uma vez
2. **Foco nas falhas**: Relatório contém apenas o que precisa ser corrigido
3. **Detalhamento completo**: Stack traces e contexto de cada falha
4. **Estatísticas úteis**: Taxa de sucesso e resumo por área
5. **Persistência**: Relatório salvo em arquivo para análise posterior
6. **Ambiente flexível**: Funciona tanto localmente quanto no CI

## Limitações

- Os testes são simulados/replicados no test runner (não executa os arquivos originais diretamente)
- Mudanças nos testes originais requerem atualização manual do test runner
- Pode haver diferenças sutis entre a execução no test runner vs execução individual

## Arquivos Relacionados

- `cypress/e2e/test-runner.cy.js` - Test runner principal
- `cypress/results/test-failures.txt` - Relatório de falhas (gerado automaticamente)
- `package.json` - Scripts para execução fácil
