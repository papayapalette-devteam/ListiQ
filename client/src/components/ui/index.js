import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#f26522] text-white hover:bg-orange-600 focus:ring-orange-500 shadow-md hover:shadow-lg',
    secondary: 'bg-[#1e293b] text-white hover:bg-[#334155] focus:ring-slate-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${!noPadding ? 'p-6' : ''} ${className}`}>
    {children}
  </div>
);

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`
        block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
        focus:outline-none focus:border-[#f26522] focus:ring-1 focus:ring-[#f26522]
        disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
