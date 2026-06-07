import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  LogOut, 
  User, 
  Calendar, 
  Plus, 
  Search,
  Check,
  X,
  QrCode,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton';
import { QrScanner } from '../components/QrScanner';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Estados de carga simulados para mejor UX
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  // Filtros avanzados
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lista mock enriquecida para probar la paginación y filtros
  const [kids, setKids] = useState([
    { id: 1, name: 'Mateo González', age: 7, section: 'Alegres (6-8 años)', status: 'present' },
    { id: 2, name: 'Sofía Rodríguez', age: 9, section: 'Valientes (9-11 años)', status: 'present' },
    { id: 3, name: 'Lucas Pérez', age: 5, section: 'Semillitas (4-5 años)', status: 'absent' },
    { id: 4, name: 'Valentina Silva', age: 8, section: 'Alegres (6-8 años)', status: 'present' },
    { id: 5, name: 'Santiago Marcano', age: 10, section: 'Valientes (9-11 años)', status: 'absent' },
    { id: 6, name: 'Camila Blanco', age: 6, section: 'Semillitas (4-5 años)', status: 'present' },
    { id: 7, name: 'Sebastián Medina', age: 7, section: 'Alegres (6-8 años)', status: 'absent' },
    { id: 8, name: 'Daniela Flores', age: 11, section: 'Valientes (9-11 años)', status: 'present' },
    { id: 9, name: 'Alejandro Rivas', age: 4, section: 'Semillitas (4-5 años)', status: 'present' },
    { id: 10, name: 'Mariana Acosta', age: 8, section: 'Alegres (6-8 años)', status: 'absent' },
    { id: 11, name: 'Nicolás Rojas', age: 9, section: 'Valientes (9-11 años)', status: 'present' },
    { id: 12, name: 'Victoria Salazar', age: 5, section: 'Semillitas (4-5 años)', status: 'absent' }
  ]);

  // Modal para agregar niños manualmente (simplificado)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newSection, setNewSection] = useState('Semillitas (4-5 años)');

  // Efecto para simular carga al cambiar filtros o búsqueda
  useEffect(() => {
    setIsTableLoading(true);
    const timer = setTimeout(() => {
      setIsTableLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [debouncedSearch, filterSection, filterStatus]);

  // Restablecer página actual si cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterSection, filterStatus]);

  // Cálculos estadísticos dinámicos
  const totalKids = kids.length;
  const presentCount = kids.filter(k => k.status === 'present').length;
  const absentCount = kids.filter(k => k.status === 'absent').length;
  const attendanceRate = totalKids > 0 ? Math.round((presentCount / totalKids) * 100) : 0;

  // Cambiar estado de asistencia interactivo
  const toggleStatus = (id) => {
    setKids(prevKids =>
      prevKids.map(kid => {
        if (kid.id === id) {
          const nextStatus = kid.status === 'present' ? 'absent' : 'present';
          toast.info(`Asistencia de ${kid.name} cambiada a ${nextStatus === 'present' ? 'Presente' : 'Ausente'}`);
          return { ...kid, status: nextStatus };
        }
        return kid;
      })
    );
  };

  // Procesar escaneo de código QR
  const handleQrScan = (decodedText) => {
    setIsScannerOpen(false);

    // Intentamos buscar por ID o por nombre exacto en el código QR
    const matchedKid = kids.find(k => 
      k.id.toString() === decodedText.trim() || 
      k.name.toLowerCase() === decodedText.trim().toLowerCase()
    );

    if (matchedKid) {
      if (matchedKid.status === 'present') {
        toast.warning(`Asistencia duplicada: ${matchedKid.name} ya está Presente.`, {
          duration: 4000
        });
      } else {
        setKids(prev => 
          prev.map(k => k.id === matchedKid.id ? { ...k, status: 'present' } : k)
        );
        toast.success(`¡Asistencia de ${matchedKid.name} registrada por QR!`, {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          duration: 4000
        });
      }
    } else {
      // Si no existe, podemos crear uno nuevo de forma dinámica para demostrar robustez
      toast.error(`Código QR no reconocido: "${decodedText}". ¿Es un alumno nuevo?`);
    }
  };

  const handleLogout = async () => {
    const logoutPromise = logout();
    toast.promise(logoutPromise, {
      loading: 'Cerrando sesión...',
      success: 'Sesión cerrada. ¡Hasta pronto!',
      error: 'Error al cerrar sesión.'
    });
  };

  // Registrar alumno nuevo
  const handleCreateKid = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newAge) {
      toast.error('Por favor completa todos los campos.');
      return;
    }

    const newKid = {
      id: Date.now(),
      name: newName.trim(),
      age: parseInt(newAge),
      section: newSection,
      status: 'present'
    };

    setKids(prev => [newKid, ...prev]);
    setNewName('');
    setNewAge('');
    setIsAddModalOpen(false);
    toast.success(`¡${newKid.name} registrado con éxito en ${newKid.section}!`);
  };

  // Filtrado de niños
  const filteredKids = kids.filter(kid => {
    const matchesSearch = kid.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          kid.section.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesSection = filterSection === 'all' || kid.section.includes(filterSection);
    const matchesStatus = filterStatus === 'all' || kid.status === filterStatus;

    return matchesSearch && matchesSection && matchesStatus;
  });

  // Cálculos de paginación
  const totalFilteredItems = filteredKids.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKids.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header Principal */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0a4693] text-white p-2 rounded-xl">
              <span className="font-display font-extrabold text-lg tracking-wider">M</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-slate-800 tracking-tight">
                Maranatha <span className="text-[#22c55e]">Kids</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                Iglesia Maranatha Venezuela
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Perfil del Usuario */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="w-8 h-8 rounded-full bg-[#0a4693]/10 text-[#0a4693] flex items-center justify-center">
                <User className="w-4 h-4" />
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-700">
                  {user?.user_metadata?.full_name || 'Coordinador'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {user?.email || 'email@maranatha.org'}
                </p>
              </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <Button
              onClick={handleLogout}
              variant="danger"
              className="py-2 px-4 text-xs font-bold rounded-xl"
              icon={LogOut}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Contenedor de Contenido */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-r from-[#0a4693] to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-3 max-w-lg">
            <div className="bg-[#22c55e] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-sm w-fit">
              <Calendar className="w-3 h-3" />
              Sesión de Hoy
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl">
              ¡Hola, {user?.user_metadata?.full_name || 'Coordinador Maranatha'}!
            </h2>
            <p className="text-blue-100 text-sm sm:text-base font-medium">
              Bienvenido al portal de asistencia. Gestiona ingresos con escaneo de cámara QR de forma móvil o filtra por secciones de enseñanza.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                onClick={() => setIsScannerOpen(true)}
                variant="success"
                icon={QrCode}
                className="shadow-md"
              >
                Escanear Código QR
              </Button>
            </div>
          </div>
        </div>

        {/* Tarjetas de Métricas Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="maranatha-card flex items-center gap-4">
            <span className="p-3 bg-blue-50 text-[#0a4693] rounded-2xl">
              <Users className="w-6 h-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Niños</p>
              <p className="text-2xl font-black text-slate-800 font-display mt-0.5">{totalKids}</p>
            </div>
          </div>

          <div className="maranatha-card flex items-center gap-4">
            <span className="p-3 bg-emerald-50 text-[#22c55e] rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Presentes</p>
              <p className="text-2xl font-black text-emerald-600 font-display mt-0.5">{presentCount}</p>
            </div>
          </div>

          <div className="maranatha-card flex items-center gap-4">
            <span className="p-3 bg-red-50 text-[#ef4444] rounded-2xl">
              <XCircle className="w-6 h-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ausentes</p>
              <p className="text-2xl font-black text-red-500 font-display mt-0.5">{absentCount}</p>
            </div>
          </div>

          <div className="maranatha-card flex items-center gap-4">
            <span className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asistencia</p>
              <p className="text-2xl font-black text-amber-600 font-display mt-0.5">{attendanceRate}%</p>
            </div>
          </div>
        </div>

        {/* Sección de Gestión */}
        <div className="maranatha-card p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-display">Listado de Asistencia</h3>
                <p className="text-xs text-slate-500 font-medium">Control de asistencia paginado y filtrado en tiempo real</p>
              </div>
              
              {/* Buscador e Interacciones */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Input
                    type="text"
                    placeholder="Buscar niño o sección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  icon={Plus}
                  className="rounded-xl px-4 py-2 text-sm"
                >
                  Nuevo
                </Button>
              </div>
            </div>

            {/* Controles de Filtros Avanzados */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-55/40 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Filtros:</span>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                {/* Filtro por Sección */}
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-maranatha-blue cursor-pointer"
                >
                  <option value="all">Todas las secciones</option>
                  <option value="Semillitas">Semillitas (4-5 años)</option>
                  <option value="Alegres">Alegres (6-8 años)</option>
                  <option value="Valientes">Valientes (9-11 años)</option>
                </select>

                {/* Filtro por Estado */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-maranatha-blue cursor-pointer"
                >
                  <option value="all">Todos los estados</option>
                  <option value="present">Presente</option>
                  <option value="absent">Ausente</option>
                </select>
                
                {/* Limpiar Filtros */}
                {(filterSection !== 'all' || filterStatus !== 'all' || searchTerm !== '') && (
                  <button
                    onClick={() => {
                      setFilterSection('all');
                      setFilterStatus('all');
                      setSearchTerm('');
                      toast.info('Filtros restablecidos');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Alumnos */}
          <div className="overflow-x-auto">
            {isTableLoading ? (
              <SkeletonTable rows={itemsPerPage} cols={5} />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Edad</th>
                    <th className="py-3 px-4">Sección</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentItems.length > 0 ? (
                    currentItems.map((kid) => (
                      <tr key={kid.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-slate-100 text-[#0a4693] flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
                              {kid.name.substring(0, 2)}
                            </span>
                            <span className="font-semibold text-sm text-slate-800">{kid.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-slate-500">{kid.age} años</td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-semibold bg-slate-100 text-slate-600 py-1 px-2.5 rounded-lg border border-slate-200">
                            {kid.section}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {kid.status === 'present' ? (
                            <span className="maranatha-badge-present">
                              <Check className="w-3 h-3" />
                              Presente
                            </span>
                          ) : (
                            <span className="maranatha-badge-absent">
                              <X className="w-3 h-3" />
                              Ausente
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => toggleStatus(kid.id)}
                            className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border cursor-pointer ${
                              kid.status === 'present'
                                ? 'bg-red-50 text-[#ef4444] border-red-100 hover:bg-red-100'
                                : 'bg-emerald-50 text-[#22c55e] border-emerald-100 hover:bg-emerald-100'
                            }`}
                          >
                            {kid.status === 'present' ? 'Marcar Ausente' : 'Marcar Presente'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400 font-medium text-sm">
                        No se encontraron resultados para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Sección de Paginación */}
          {filteredKids.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4 flex-wrap gap-4">
              <span className="text-xs text-slate-500 font-medium">
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, totalFilteredItems)} de {totalFilteredItems} alumnos
              </span>
              
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="p-2 min-w-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    variant={currentPage === i + 1 ? 'primary' : 'outline'}
                    className={`px-3 py-1.5 text-xs min-w-[32px]`}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="p-2 min-w-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Escáner de Códigos QR (Modal) */}
      {isScannerOpen && (
        <QrScanner
          onScanSuccess={handleQrScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {/* Modal para Registrar Alumno Nuevo (Manual) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-800 font-display mb-4">Registrar Nuevo Alumno</h3>
            
            <form onSubmit={handleCreateKid} className="space-y-4">
              <Input
                label="Nombre Completo"
                placeholder="Ej. Mateo Silva"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />

              <Input
                label="Edad"
                type="number"
                placeholder="Ej. 7"
                min="0"
                max="17"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                required
              />

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sección / Aula
                </label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 py-2.5 px-4 text-sm outline-none transition-all duration-200 focus:border-[#0a4693] focus:ring-4 focus:ring-blue-50 bg-white"
                >
                  <option value="Semillitas (4-5 años)">Semillitas (4-5 años)</option>
                  <option value="Alegres (6-8 años)">Alegres (6-8 años)</option>
                  <option value="Valientes (9-11 años)">Valientes (9-11 años)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  icon={PlusCircle}
                >
                  Añadir
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 font-medium">
          Iglesia Maranatha Venezuela &copy; {new Date().getFullYear()} • Plataforma de Gestión Integrada. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
