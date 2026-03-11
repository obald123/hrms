'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@/icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  console.log('Toast render:', { message, type, isVisible }); // Debug log
  
  useEffect(() => {
    if (isVisible) {
      console.log('Toast is visible, setting timer'); // Debug log
      const timer = setTimeout(() => {
        console.log('Timer expired, calling onClose'); // Debug log
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    console.log('Toast not visible, returning null'); // Debug log
    return null;
  }

  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
  console.log('Toast rendering with bgColor:', bgColor); // Debug log

  return (
    <div className="fixed top-4 right-4 z-[999999] animate-slideIn">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        {type === 'success' && (
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5" />
          </div>
        )}
        {type === 'error' && (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
