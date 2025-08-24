import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simula dados iniciais
  useEffect(() => {
    const initialItems = [
      { id: 1, name: 'Item de Exemplo 1', description: 'Descrição do primeiro item', completed: false, createdAt: new Date().toISOString() },
      { id: 2, name: 'Item de Exemplo 2', description: 'Descrição do segundo item', completed: true, createdAt: new Date().toISOString() },
      { id: 3, name: 'Item de Exemplo 3', description: 'Descrição do terceiro item', completed: false, createdAt: new Date().toISOString() }
    ];
    setItems(initialItems);
  }, []);

  // Funções de autenticação
  const login = async (email, password) => {
    setIsLoading(true);
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validação simples para demo
    if (email && password) {
      const userData = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      setUser(userData);
      setIsLoading(false);
      return { success: true, user: userData };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Credenciais inválidas' };
  };

  const register = async (userData) => {
    setIsLoading(true);
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now(),
      ...userData,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
    };
    
    setUser(newUser);
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  // Funções CRUD para itens
  const addItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemComplete = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const value = {
    // Estado
    user,
    items,
    isLoading,
    
    // Autenticação
    login,
    register,
    logout,
    
    // CRUD
    addItem,
    updateItem,
    deleteItem,
    toggleItemComplete
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}

