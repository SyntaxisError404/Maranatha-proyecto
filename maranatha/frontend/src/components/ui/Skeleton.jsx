import React from 'react';

// Esqueleto básico flexible
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-lg ${className}`}
      {...props}
    />
  );
};

// Esqueleto para tarjetas de métricas o paneles
export const SkeletonCard = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm w-full">
      <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  );
};

// Esqueleto para textos o descripciones
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${
            i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Esqueleto específico para tablas
export const SkeletonTable = ({ rows = 4, cols = 4 }) => {
  return (
    <div className="w-full border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Cabecera del esqueleto */}
      <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex gap-4">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Filas */}
      <div className="p-4 space-y-4">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 items-center">
            {[...Array(cols)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
