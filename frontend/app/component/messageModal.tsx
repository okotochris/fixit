// components/MessageModal.tsx
'use client';

import { useEffect } from 'react';

interface MessageModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  buttonText?: string;
}

export default function MessageModal({
  message,
  isOpen,
  onClose,
  title = "Information",
  buttonText = "OK",
}: MessageModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent scrolling behind modal
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Backdrop - clicking outside closes */}
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div 
        className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Message body */}
        <div className="px-6 py-8 text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer with OK button */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex justify-center">
          <button
            onClick={onClose}
            className="min-w-[120px] px-6 py-3 text-base font-medium text-white 
                     bg-amber-600 rounded-lg hover:bg-amber-700 
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 
                     transition-colors duration-200 shadow-sm"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}