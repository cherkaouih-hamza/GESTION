import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-40 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-right">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              تأكيد الحذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;