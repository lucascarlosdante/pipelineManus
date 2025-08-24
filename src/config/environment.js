// Configuração de ambientes para diferenciação visual
export const environments = {
  dev: {
    name: 'Desenvolvimento',
    color: '#10B981', // Verde
    bgColor: '#ECFDF5',
    textColor: '#065F46'
  },
  tst: {
    name: 'Teste',
    color: '#F59E0B', // Amarelo
    bgColor: '#FFFBEB',
    textColor: '#92400E'
  },
  hml: {
    name: 'Homologação',
    color: '#3B82F6', // Azul
    bgColor: '#EFF6FF',
    textColor: '#1E40AF'
  },
  prd: {
    name: 'Produção',
    color: '#EF4444', // Vermelho
    bgColor: '#FEF2F2',
    textColor: '#991B1B'
  }
};

// Detecta o ambiente atual baseado na URL ou variável de ambiente
export const getCurrentEnvironment = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Para GitHub Pages, detecta pelo pathname
  if (pathname.includes('/dev')) return 'dev';
  if (pathname.includes('/tst')) return 'tst';
  if (pathname.includes('/hml')) return 'hml';
  if (pathname.includes('/prd')) return 'prd';
  
  // Para desenvolvimento local
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'dev';
  
  // Default para produção
  return 'prd';
};

export const getEnvironmentConfig = () => {
  const env = getCurrentEnvironment();
  return {
    current: env,
    ...environments[env]
  };
};

