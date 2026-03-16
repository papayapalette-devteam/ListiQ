import React from 'react';
import { Copy, Check, Info, PackageOpen, Search, MessageSquarePlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard', { duration: 1500 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-brand ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export const Spinner = ({ size = 'md', color = 'brand' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const colors = { 
    brand: 'text-brand', 
    white: 'text-white',
    amazon: 'text-amazon',
    flipkart: 'text-flipkart',
    meesho: 'text-meesho'
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizes[size]} ${colors[color] || 'text-brand'}`}></div>
  );
};

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export const EmptyState = ({ type, title, description, actionText, onAction }) => {
  const icons = {
    listings: PackageOpen,
    search: Search,
    chat: MessageSquarePlus
  };
  const Icon = icons[type] || PackageOpen;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-card border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6 max-w-xs">{description}</p>
      {actionText && (
        <button 
          onClick={onAction}
          className="px-6 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-orange-100"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center gap-6">
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-orange-200">L</div>
      <h1 className="text-3xl font-black text-navy tracking-tighter">ListiQ</h1>
    </div>
    <Spinner size="lg" />
  </div>
);
