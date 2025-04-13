import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary'
}) => {
  if (!isOpen) return null;
  
  // Prevent clicks on the modal from bubbling to the overlay
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Determine button color based on variant
  const getButtonClass = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'secondary':
        return 'bg-secondary hover:bg-opacity-90';
      default:
        return 'bg-primary hover:bg-opacity-90';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div 
        className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg max-w-md w-full p-6"
        onClick={handleModalClick}
      >
        <h2 className="text-xl font-semibold mb-2 text-text-light-primary dark:text-text-primary">
          {title}
        </h2>
        
        <p className="text-text-light-secondary dark:text-text-secondary mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-text-light-secondary dark:text-text-secondary bg-transparent hover:bg-light-background dark:hover:bg-dark-background"
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${getButtonClass()}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;