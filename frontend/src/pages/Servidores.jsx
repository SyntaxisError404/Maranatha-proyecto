import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, X, UserCog, Filter, Shield 
} from 'lucide-react';
import { toast } from 'sonner';
import { mockServidores } from '../data/mockData';

export const Servidores = () => {
  const [servidores, setServidores] = useState(mockServidores || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentServidor, setCurrentServidor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    grupo: 'Maternal',
    funcion: 'Servidor'
  });

  const grupos = [
    'Todos',
    'Maternal',
    'Infantil',
    'Prejuvenil',
    'Logística Operativa',
    'Almacén',
    'Secretaría',
    'Distribución Alimentos'
  ];

  const funciones = [
    'Capitán',
    'Mano Derecha',
    'Servidor',
    'Encargado',
    'Líder',
    'Asistente'
  ];

  const handleOpenModal = (servidor = null) => {
    if (servidor) {
      setCurrentServidor(servidor);
      setFormData({
        nombre: servidor.nombre || servidor.name || '',
        grupo: servidor.grupo || servidor.group || 'Maternal',
        funcion: servidor.funcion || servidor.role || 'Servidor'
      });
    } else {
      setCurrentServidor(null);
      setFormData({
        nombre: '',
        grupo: 'Maternal',
        funcion: 'Servidor'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentServidor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    if (currentServidor) {
      setServidores(servidores.map(s => 
        s.id === currentServidor.id ? { ...s, ...formData } : s
      ));
      toast.success('Servidor actualizado correctamente');
    } else {
      const newId = servidores.length > 0 ? Math.max(...servidores.map(s => s.id || 0)) + 1 : 1;
      setServidores([...servidores, { id: newId, ...formData }]);
      toast.success('Servidor agregado correctamente');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este servidor?')) {
      setServidores(servidores.filter(s => s.id !== id));
      toast.success('Servidor eliminado correctamente');
    }
  };

  const normalizedServidores = servidores.map(s => ({
    ...s,
    nombre: s.nombre || s.name || '',
    grupo: s.grupo || s.group || '',
    funcion: s.funcion || s.role || ''
  }));

  const filteredServidores = normalizedServidores.filter(servidor => {
    const matchesSearch = servidor.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'Todos' || servidor.grupo === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getGroupColor = (grupo) => {
    const colors = {
      'Maternal': 'bg-pink-500/20 text-pink-500 border-pink-500/30',
      'Infantil': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      'Prejuvenil': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
      'Logística Operativa': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      'Almacén': 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      'Secretaría': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
      'Distribución Alimentos': 'bg-orange-500/20 text-orange-500 border-orange-500/30'
    };
    return colors[grupo] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRoleColor = (role) => {
    if (role === 'Capitán' || role === 'Líder') return 'text-amber-400';
    if (role === 'Mano Derecha') return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCog className="h-6 w-6 text-brand-primary" />
            Gestión de Servidores
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Administra el registro de voluntarios por grupo y función.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="maranatha-btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          AGREGAR SERVIDOR
        </button>
      </div>

      {/* Filters */}
      <div className="maranatha-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar Nombre..." 
            className="maranatha-input w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:w-64">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            className="maranatha-select w-full"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            {grupos.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="maranatha-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Grupo</th>
                <th>Función</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServidores.length > 0 ? (
                filteredServidores.map((servidor) => (
                  <motion.tr 
                    key={servidor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="member-avatar">
                          {getInitials(servidor.nombre)}
                        </div>
                        <div className="font-medium text-white">{servidor.nombre}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGroupColor(servidor.grupo)}`}>
                        {servidor.grupo}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Shield className={`h-4 w-4 ${getRoleColor(servidor.funcion)}`} />
                        <span className="text-gray-300">{servidor.funcion}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(servidor)}
                          className="p-2 text-gray-400 hover:text-brand-secondary transition-colors rounded-lg hover:bg-white/5"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(servidor.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-400">
                    No se encontraron servidores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="maranatha-card w-full max-w-md p-6 relative border-brand-primary/20 border"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-6">
                {currentServidor ? 'Editar Servidor' : 'Nuevo Servidor'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="maranatha-input w-full"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Grupo
                  </label>
                  <select
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    className="maranatha-select w-full"
                  >
                    {grupos.filter(g => g !== 'Todos').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Función
                  </label>
                  <select
                    name="funcion"
                    value={formData.funcion}
                    onChange={handleChange}
                    className="maranatha-select w-full"
                  >
                    {funciones.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 maranatha-btn-primary"
                  >
                    {currentServidor ? 'Guardar Cambios' : 'Agregar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
