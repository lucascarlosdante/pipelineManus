import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  User, 
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '../contexts/AppContext';
import { getEnvironmentConfig } from '../config/environment';

const itemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Prioridade é obrigatória' }),
  category: z.string().min(1, 'Categoria é obrigatória'),
});

export function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const { user, items, addItem, updateItem, deleteItem, toggleItemComplete, logout } = useApp();
  const navigate = useNavigate();
  const envConfig = getEnvironmentConfig();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    setValue: setValueAdd,
    formState: { errors: errorsAdd },
  } = useForm({
    resolver: zodResolver(itemSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm({
    resolver: zodResolver(itemSchema),
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onAddItem = (data) => {
    addItem(data);
    resetAdd();
    setIsAddModalOpen(false);
  };

  const onEditItem = (data) => {
    updateItem(editingItem.id, data);
    resetEdit();
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setValueEdit('name', item.name);
    setValueEdit('description', item.description);
    setValueEdit('priority', item.priority || 'medium');
    setValueEdit('category', item.category || 'geral');
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteItem(id);
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(id => deleteItem(id));
    setSelectedItems([]);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Não definida';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Badge variant="outline" style={{ borderColor: envConfig.color, color: envConfig.color }}>
              {envConfig.name}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40" data-testid="priority-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                data-testid="bulk-delete-button"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir ({selectedItems.length})
              </Button>
            )}
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  style={{ backgroundColor: envConfig.color }}
                  data-testid="add-item-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="add-item-modal">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Item</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo item abaixo.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmitAdd(onAddItem)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Nome</Label>
                    <Input
                      id="add-name"
                      placeholder="Nome do item"
                      data-testid="add-name-input"
                      {...registerAdd('name')}
                    />
                    {errorsAdd.name && (
                      <p className="text-sm text-destructive">{errorsAdd.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-description">Descrição</Label>
                    <Textarea
                      id="add-description"
                      placeholder="Descrição do item"
                      data-testid="add-description-input"
                      {...registerAdd('description')}
                    />
                    {errorsAdd.description && (
                      <p className="text-sm text-destructive">{errorsAdd.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-priority">Prioridade</Label>
                      <Select onValueChange={(value) => setValueAdd('priority', value)}>
                        <SelectTrigger data-testid="add-priority-select">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      {errorsAdd.priority && (
                        <p className="text-sm text-destructive">{errorsAdd.priority.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-category">Categoria</Label>
                      <Select onValueChange={(value) => setValueAdd('category', value)}>
                        <SelectTrigger data-testid="add-category-select">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geral">Geral</SelectItem>
                          <SelectItem value="trabalho">Trabalho</SelectItem>
                          <SelectItem value="pessoal">Pessoal</SelectItem>
                          <SelectItem value="projeto">Projeto</SelectItem>
                        </SelectContent>
                      </Select>
                      {errorsAdd.category && (
                        <p className="text-sm text-destructive">{errorsAdd.category.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddModalOpen(false)}
                      data-testid="add-cancel-button"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      style={{ backgroundColor: envConfig.color }}
                      data-testid="add-submit-button"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Itens ({filteredItems.length})</CardTitle>
            <CardDescription>
              Gerencie seus itens aqui. Use os filtros para encontrar itens específicos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table data-testid="items-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={handleSelectAll}
                      data-testid="select-all-checkbox"
                    />
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} data-testid={`item-row-${item.id}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                        data-testid={`select-item-${item.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(item.priority)}>
                        {getPriorityLabel(item.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{item.category || 'Geral'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemComplete(item.id)}
                        data-testid={`toggle-complete-${item.id}`}
                      >
                        {item.completed ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`item-actions-${item.id}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(item)}
                            data-testid={`edit-item-${item.id}`}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive"
                            data-testid={`delete-item-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum item encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent data-testid="edit-item-modal">
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
              <DialogDescription>
                Atualize os dados do item abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitEdit(onEditItem)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  placeholder="Nome do item"
                  data-testid="edit-name-input"
                  {...registerEdit('name')}
                />
                {errorsEdit.name && (
                  <p className="text-sm text-destructive">{errorsEdit.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Descrição do item"
                  data-testid="edit-description-input"
                  {...registerEdit('description')}
                />
                {errorsEdit.description && (
                  <p className="text-sm text-destructive">{errorsEdit.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Prioridade</Label>
                  <Select onValueChange={(value) => setValueEdit('priority', value)}>
                    <SelectTrigger data-testid="edit-priority-select">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorsEdit.priority && (
                    <p className="text-sm text-destructive">{errorsEdit.priority.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select onValueChange={(value) => setValueEdit('category', value)}>
                    <SelectTrigger data-testid="edit-category-select">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geral">Geral</SelectItem>
                      <SelectItem value="trabalho">Trabalho</SelectItem>
                      <SelectItem value="pessoal">Pessoal</SelectItem>
                      <SelectItem value="projeto">Projeto</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorsEdit.category && (
                    <p className="text-sm text-destructive">{errorsEdit.category.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  data-testid="edit-cancel-button"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  style={{ backgroundColor: envConfig.color }}
                  data-testid="edit-submit-button"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

