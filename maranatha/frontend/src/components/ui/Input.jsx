import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  id,
  type = 'text',
  className = '',
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col font-sans ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 cursor-pointer"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4.5 h-4.5" />
          </span>
        )}
        
        <input
          id={id}
          type={type}
          ref={ref}
          className={`
            w-full rounded-xl border-2 py-2.5 px-4 text-sm outline-none transition-all duration-200 bg-white text-slate-800
            ${Icon ? 'pl-11' : ''}
            ${RightIcon ? 'pr-11' : ''}
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-slate-200 focus:border-maranatha-blue focus:ring-4 focus:ring-blue-50'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          `}
          {...props}
        />
        
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={!onRightIconClick}
            className={`absolute right-3.5 text-slate-400 ${
              onRightIconClick ? 'cursor-pointer hover:text-slate-600 active:scale-95 transition-all' : 'pointer-events-none'
            }`}
          >
            <RightIcon className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-red-500 mt-1.5 flex items-center gap-1.5 animate-pulse">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
