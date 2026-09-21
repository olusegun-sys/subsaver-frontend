import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// WHY: Blue-accented toasts to match the SubSaver brand
const toastTypes = {
  success: { icon: CheckCircle, bgColor: 'bg-white', borderColor: 'border-l-emerald-500', textColor: 'text-slate-800', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  error:   { icon: AlertCircle, bgColor: 'bg-white', borderColor: 'border-l-red-500',     textColor: 'text-slate-800', iconColor: 'text-red-600',     iconBg: 'bg-red-50' },
  info:    { icon: Info,        bgColor: 'bg-white', borderColor: 'border-l-blue-500',    textColor: 'text-slate-800', iconColor: 'text-blue-600',    iconBg: 'bg-blue-50' }
};

function ToastItem({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastTypes[type] || toastTypes.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-xl shadow-lg shadow-slate-900/10 p-4 mb-3 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } border border-slate-200/70`}
      style={{ minWidth: '280px', maxWidth: '400px' }}
    >
      <div className="flex items-start gap-3">
        <div className={`${config.iconBg} rounded-lg p-1.5 flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1 pt-0.5">
          <p className={`${config.textColor} text-sm font-medium leading-snug`}>{message}</p>
        </div>
        <button
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-md hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

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
    return () => { toastContainerRef = null; };
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end max-w-[calc(100vw-2rem)]">
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

export const toast = {
  success: (message) => toastContainerRef ? toastContainerRef.addToast(message, 'success') : console.warn('Toast not mounted'),
  error:   (message) => toastContainerRef ? toastContainerRef.addToast(message, 'error')   : console.warn('Toast not mounted'),
  info:    (message) => toastContainerRef ? toastContainerRef.addToast(message, 'info')    : console.warn('Toast not mounted')
};

export default ToastContainer;