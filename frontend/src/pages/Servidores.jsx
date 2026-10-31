import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit2, Trash2, X, UserCog, Filter, Shield, Users as UsersIcon, HardDrive,
} from 'lucide-react';
import { toast } from 'sonner';
import { getIniciales, formatNombre } from '../utils/formatters';
import { useServidores } from '../hooks/useServidores';
import { SkeletonTable } from '../components/ui/Skeleton';

const GRUPOS = [
  'Todos',
  'Maternal',
  'Infantil',
  'Prejuvenil',
  'Logística Operativa',
  'Almacén',
  'Secretaría',
  'Distribución Alimentos',
];

const FUNCIONES = [
  'Capitán',
  'Capitán Área',
  'Mano Derecha',
  'Servidor',
  'Encargado',
  'Líder',
  'Asistente',
];

// Colores de badge por grupo (tema claro)
const GROUP_COLORS = {
  'Maternal': 'bg-pink-50 text-pink-700 border-pink-200',
  'Infantil': 'bg-purple-50 text-purple-700 border-purple-200',
  'Prejuvenil': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Logística Operativa': 'bg-blue-50 text-blue-700 border-blue-200',
  'Almacén': 'bg-amber-50 text-amber-700 border-amber-200',
  'Secretaría': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Distribución Alimentos': 'bg-orange-50 text-orange-700 border-orange-200',
};

const getGroupColor = (grupo) =>
  GROUP_COLORS[grupo] || 'bg-slate-100 text-slate-600 border-slate-200';

const getRoleColor = (role) => {
  if (/capit|líder|lider/i.test(role)) return 'text-amber-600';
  if (/mano derecha/i.test(role)) return 'text-blue-600';
  return 'text-slate-500';
};

export const Servidores = () => {
  const { servidores, loading, modoLocal, add, update, remove } = useServidores();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentServidor, setCurrentServidor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    grupo: 'Maternal',
    funcion: 'Servidor',
  });

  const handleOpenModal = (servidor = null) => {
    if (servidor) {
      setCurrentServidor(servidor);
      setFormData({
        nombre: servidor.nombre || '',
        grupo: servidor.grupo || 'Maternal',
        funcion: servidor.funcion || servidor.funcionDefault || 'Servidor',
      });
    } else {
      setCurrentServidor(null);
      setFormData({ nombre: '', grupo: 'Maternal', funcion: 'Servidor' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentServidor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    const limpio = { ...formData, nombre: formatNombre(formData.nombre) };
    setSaving(true);
    const res = currentServidor
      ? await update(currentServidor.id, limpio)
      : await add(limpio);
    setSaving(false);

    if (res.ok) {
      toast.success(currentServidor ? 'Servidor actualizado correctamente' : 'Servidor agregado correctamente');
      handleCloseModal();
    } else {
      toast.error('No se pudo guardar. Intenta de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este servidor?')) return;
    const res = await remove(id);
    if (res.ok) toast.success('Servidor eliminado correctamente');
    else toast.error('No se pudo eliminar. Intenta de nuevo.');
  };

  const filtrados = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return servidores.filter((s) => {
      const matchSearch = (s.nombre || '').toLowerCase().includes(term);
      const matchGroup = groupFilter === 'Todos' || s.grupo === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [servidores, searchTerm, groupFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCog className="h-6 w-6 text-maranatha-blue" />
            Gestión de Servidores
          </h1>
          <p className="page-subtitle">
            Administra el registro de voluntarios por grupo y función.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="maranatha-btn-primary"
        >
          <Plus className="h-4 w-4" />
          AGREGAR SERVIDOR
        </button>
      </div>

      {/* Filtros */}
      <div className="maranatha-card flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar nombre..."
            className="maranatha-input w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:w-72">
          <Filter className="h-5 w-5 text-slate-400 shrink-0" />
          <select
            className="maranatha-select w-full"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            {GRUPOS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contador */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
          <UsersIcon className="h-4 w-4" />
          {filtrados.length} servidor{filtrados.length === 1 ? '' : 'es'}
          {groupFilter !== 'Todos' && ` en ${groupFilter}`}
        </p>
        {modoLocal && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full"
            title="Sin conexión a Supabase: los cambios se guardan en este dispositivo."
          >
            <HardDrive className="h-3.5 w-3.5" />
            Modo local
          </span>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : (
      <div className="maranatha-card overflow-hidden" style={{ padding: 0 }}>
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
              {filtrados.length > 0 ? (
                filtrados.map((servidor) => (
                  <motion.tr
                    key={servidor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="member-avatar">
                          {getIniciales(servidor.nombre)}
                        </div>
                        <div className="font-medium text-slate-800">
                          {servidor.nombre}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGroupColor(servidor.grupo)}`}
                      >
                        {servidor.grupo}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Shield className={`h-4 w-4 ${getRoleColor(servidor.funcion)}`} />
                        <span className="text-slate-600">{servidor.funcion}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(servidor)}
                          className="action-btn"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(servidor.id)}
                          className="action-btn hover:!text-red-500"
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
                  <td colSpan="4" className="text-center py-8 text-slate-400">
                    No se encontraron servidores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="action-btn absolute top-4 right-4"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-800 mb-6">
                {currentServidor ? 'Editar Servidor' : 'Nuevo Servidor'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
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
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Grupo
                  </label>
                  <select
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    className="maranatha-select w-full"
                  >
                    {GRUPOS.filter((g) => g !== 'Todos').map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Función
                  </label>
                  <select
                    name="funcion"
                    value={formData.funcion}
                    onChange={handleChange}
                    className="maranatha-select w-full"
                  >
                    {FUNCIONES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold text-sm"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 maranatha-btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : currentServidor ? 'Guardar Cambios' : 'Agregar'}
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
