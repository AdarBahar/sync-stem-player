import { memo } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, Toast, ToastType } from '../contexts/ToastContext';

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-emerald-900/90 border-emerald-500',
        icon: 'text-emerald-400',
        IconComponent: CheckCircle,
      };
    case 'error':
      return {
        container: 'bg-red-900/90 border-red-500',
        icon: 'text-red-400',
        IconComponent: AlertCircle,
      };
    case 'warning':
      return {
        container: 'bg-amber-900/90 border-amber-500',
        icon: 'text-amber-400',
        IconComponent: AlertTriangle,
      };
    case 'info':
    default:
      return {
        container: 'bg-blue-900/90 border-blue-500',
        icon: 'text-blue-400',
        IconComponent: Info,
      };
  }
};

const ToastItem = memo(({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const styles = getToastStyles(toast.type);
  const { IconComponent } = styles;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-slide-in ${styles.container}`}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${styles.icon}`} />
      <p className="text-white text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;

