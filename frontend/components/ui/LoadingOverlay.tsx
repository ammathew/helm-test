import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingOverlayProps {
    isUploading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isUploading }) => {
    if (!isUploading) {
        return null;
    }

    return (
        <div className="absolute inset-0 bg-gray-200 opacity-50 flex items-center justify-center">
            <FaSpinner className="animate-spin text-blue-500 text-8xl" />
        </div>
    );
};

export default LoadingOverlay;