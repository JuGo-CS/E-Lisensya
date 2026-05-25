import React from 'react';

const ConfirmModal = ({ visible, title, message, onCancel, onConfirm }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel}></div>
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-lg z-10">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="bg-gray-200 rounded px-3 py-1">Cancel</button>
                    <button onClick={async () => { await onConfirm(); }} className="bg-green-600 text-white rounded px-3 py-1">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
