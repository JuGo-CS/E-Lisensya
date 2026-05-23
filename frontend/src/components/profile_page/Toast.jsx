import React from 'react';

const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className={
                `max-w-md w-full rounded px-4 py-2 text-sm shadow ${toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}`
            }>
                {toast.message}
            </div>
        </div>
    );
};

export default Toast;
