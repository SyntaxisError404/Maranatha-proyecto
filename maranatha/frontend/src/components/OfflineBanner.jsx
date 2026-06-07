import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      toast.success('Conexión a internet restablecida.');
      
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
      toast.warning('Has perdido la conexión a internet. Trabajando en modo local.', {
        duration: 5000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    // Simular un retardo breve de ping
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const online = navigator.onLine;
    setIsOnline(online);
    setIsChecking(false);

    if (online) {
      toast.success('¡Conexión verificada exitosamente!');
    } else {
      toast.error('Aún no hay conexión a internet. Reintenta en unos instantes.');
    }
  };

  if (isOnline && !showRestored) return null;

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50 text-white font-sans text-xs font-bold transition-all duration-300 transform
      ${isOnline 
        ? 'bg-emerald-500 shadow-emerald-500/10 translate-y-0' 
        : 'bg-red-500 shadow-red-500/10 translate-y-0'
      }
      flex items-center justify-center py-2 px-4 gap-2.5 shadow-md text-center
    `}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 animate-bounce" />
          <span>¡Conexión restaurada! Volviendo al modo online...</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Estás desconectado. Trabajando de forma local (Offline).</span>
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="ml-2 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-lg border border-white/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Verificar</span>
          </button>
        </>
      )}
    </div>
  );
};
