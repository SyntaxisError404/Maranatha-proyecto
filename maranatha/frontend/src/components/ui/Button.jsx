import React from 'react';

export const Button = ({
  children,
  className = '',
  variant = 'primary', // 'primary' | 'success' | 'danger' | 'outline' | 'secondary'
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  // Clases base premium con micro-animaciones
  const baseStyle = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-in-out cursor-pointer select-none rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 font-sans focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-maranatha-blue text-white hover:bg-blue-800 shadow-md hover:shadow-lg focus:ring-maranatha-blue',
    success: 'bg-kids-green text-white hover:bg-emerald-600 shadow-md hover:shadow-lg focus:ring-kids-green',
    danger: 'bg-kids-red text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-kids-red',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300'
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${currentVariant} py-2.5 px-5 text-sm ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {Icon && <Icon className="w-4.5 h-4.5 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
