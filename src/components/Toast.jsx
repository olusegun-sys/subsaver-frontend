import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Toast types with matching icons and colors
const toastTypes = {
  success: { icon: CheckCircle, bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-800', iconColor: 'text-green-500' },
  error: { icon: AlertCircle, bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-800', iconColor: 'text-red-500' },
  info: { icon: Info, bgColor: 'bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-800', iconColor: 'text-blue-500' }
};

function ToastItem({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastTypes[type] || toastTypes.info;
  const Icon = config.icon;

  // Auto-hide after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-lg shadow-lg p-4 mb-3 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      style={{ minWidth: '300px', maxWidth: '400px' }}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`${config.textColor} text-sm`}>{message}</p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast container that holds multiple toasts
let toastContainerRef = null;

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastContainerRef = { addToast: (message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    }};
    
    return () => {
      toastContainerRef = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Global toast functions
export const toast = {
  success: (message) => {
    if (toastContainerRef) {
      toastContainerRef.addToast(message, 'success');
    } else {
      console.warn('Toast container not mounted yet');
    }
  },
  error: (message) => {
    if (toastContainerRef) {
      toastContainerRef.addToast(message, 'error');
    } else {
      console.warn('Toast container not mounted yet');
    }
  },
  info: (message) => {
    if (toastContainerRef) {
      toastContainerRef.addToast(message, 'info');
    } else {
      console.warn('Toast container not mounted yet');
    }
  }
};

export default ToastContainer;