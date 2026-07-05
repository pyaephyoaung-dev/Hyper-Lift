import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

interface AlertMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const AlertMessage = ({ type, message, onClose }: AlertMessageProps) => {
  const styles = {
    success: 'bg-green-900/30 border-green-500 text-green-400',
    error: 'bg-red-900/30 border-red-500 text-red-400',
    info: 'bg-blue-900/30 border-blue-500 text-blue-400',
    warning: 'bg-yellow-900/30 border-yellow-500 text-yellow-400',
  };

  const icons = {
    success: <FiCheckCircle className="text-xl" />,
    error: <FiAlertCircle className="text-xl" />,
    info: <FiInfo className="text-xl" />,
    warning: <FiAlertCircle className="text-xl" />,
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${styles[type]} mb-4`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <FiX className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
