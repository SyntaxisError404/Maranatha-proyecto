import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const QrScanner = ({ onScanSuccess, onClose }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const qrCodeInstanceRef = useRef(null);
  const scannerId = 'maranatha-qr-reader';

  // Obtener cámaras disponibles al montar
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Preferir cámara trasera por defecto si está disponible
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('trasera')
          );
          setActiveCameraId(backCamera ? backCamera.id : devices[0].id);
          setHasPermission(true);
        } else {
          setHasPermission(false);
          toast.error('No se encontraron cámaras en este dispositivo.');
        }
      })
      .catch((err) => {
        console.error('Error obteniendo cámaras:', err);
        setHasPermission(false);
        toast.error('Permiso de cámara denegado o no disponible.');
      });

    return () => {
      stopScanner();
    };
  }, []);

  // Iniciar el escaneo cuando se tiene cámara activa
  useEffect(() => {
    if (activeCameraId && hasPermission && !isScanning) {
      startScanner(activeCameraId);
    }
  }, [activeCameraId, hasPermission]);

  const startScanner = async (cameraId) => {
    try {
      if (qrCodeInstanceRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode(scannerId);
      qrCodeInstanceRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: (width, height) => {
          const size = Math.min(width, height) * 0.7;
          return { width: size, height: size };
        }
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          // Éxito al escanear
          // Hacemos sonar una vibración breve si el navegador lo soporta
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
          toast.success('Código QR escaneado con éxito');
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Errores de lectura continuos (se ignoran por consola para evitar spam)
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Fallo al iniciar el escáner:', err);
      toast.error('Error al encender la cámara.');
    }
  };

  const stopScanner = async () => {
    if (qrCodeInstanceRef.current && qrCodeInstanceRef.current.isScanning) {
      try {
        await qrCodeInstanceRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error deteniendo el escáner:', err);
      }
    }
  };

  const toggleCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setActiveCameraId(cameras[nextIndex].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 font-sans text-white">
      <div className="relative w-full max-w-md bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700 flex flex-col overflow-hidden">
        
        {/* Cabecera del Escáner */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg leading-tight">Lector de Códigos QR</h3>
              <p className="text-xs text-slate-400">Apunta al código para registrar la asistencia</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Contenedor del Lector de Cámara */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-slate-700">
          
          {/* El div donde html5-qrcode inyecta el video */}
          <div id={scannerId} className="w-full h-full object-cover"></div>

          {/* Recuadro guía visual personalizado */}
          <div className="absolute inset-0 border-2 border-transparent flex items-center justify-center pointer-events-none z-10">
            <div className="relative w-4/5 h-4/5 max-w-[280px] max-h-[280px] border-2 border-[#22c55e] rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)]">
              {/* Esquinas reforzadas */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#22c55e] -mt-1 -ml-1 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#22c55e] -mt-1 -mr-1 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#22c55e] -mb-1 -ml-1 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#22c55e] -mb-1 -mr-1 rounded-br-md"></div>
              
              {/* Línea de escaneo láser */}
              <div className="absolute left-0 right-0 h-0.5 bg-[#22c55e] shadow-[0_0_8px_#22c55e] top-1/2 animate-[bounce_2s_infinite]"></div>
            </div>
          </div>

          {hasPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
              <CameraOff className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-sm font-semibold">Cámara no disponible</p>
              <p className="text-xs text-slate-400 mt-1">Por favor concede los permisos de cámara e intenta de nuevo.</p>
            </div>
          )}
        </div>

        {/* Acciones e Info de Cámara */}
        <div className="flex items-center justify-between mt-5 gap-3">
          <p className="text-xs text-slate-400 truncate max-w-[70%]">
            {cameras.length > 0
              ? `Cámara: ${cameras.find(c => c.id === activeCameraId)?.label || 'Cámara activa'}`
              : 'Detectando cámara...'}
          </p>

          {cameras.length > 1 && (
            <button
              onClick={toggleCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Cambiar Cámara
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
