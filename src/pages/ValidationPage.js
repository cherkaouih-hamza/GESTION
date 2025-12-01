import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/ValidationPage.css';

const ValidationPage = () => {
  const { currentUser, getTasksForValidation, updateTaskStatus, getAllTasks } = useAuth();
  const [tasks, setTasks] = useState(getTasksForValidation());
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [taskToReject, setTaskToReject] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');

  const handleApproveTask = async (taskId) => {
    try {
      updateTaskStatus(taskId, 'جارية', currentUser.id);
      // Update local state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  const handleRejectTask = async (taskId) => {
    try {
      updateTaskStatus(taskId, 'مرفوضة', currentUser.id, rejectionComment);
      // Update local state
      setTasks(tasks.filter(task => task.id !== taskId));
      setShowRejectModal(false);
      setTaskToReject(null);
      setRejectionComment('');
    } catch (error) {
      console.error('Error rejecting task:', error);
    }
  };

  const openRejectModal = (task) => {
    setTaskToReject(task);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setTaskToReject(null);
    setRejectionComment('');
  };

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 text-right">صفحة المسؤول</h1>
          <p className="text-gray-600 text-right">قائمة المهام في انتظار الموافقة</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
            <p className="text-gray-600">المهام في الانتظار</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-2xl font-bold text-green-600">
              {getAllTasks().filter(t => t.status === 'جارية').length}
            </p>
            <p className="text-gray-600">المهام الجارية</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-2xl font-bold text-red-600">
              {getAllTasks().filter(t => t.status === 'مرفوضة').length}
            </p>
            <p className="text-gray-600">المهام المرفوضة</p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم المهمة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع المهمة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التواريخ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رابط الوسائط
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الملاحظة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {task.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {task.createdBy === 3 ? 'المستخدم' : task.createdBy === 2 ? 'المسؤول' : 'المدير'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-right">
                        {new Date(task.startDate).toLocaleDateString('ar-MA')} - {new Date(task.endDate).toLocaleDateString('ar-MA')}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {task.mediaLink ? (
                          <a 
                            href={task.mediaLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            عرض
                          </a>
                        ) : (
                          'لا يوجد'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-right">
                        {/* Field for responsables to add comments */}
                        <textarea
                          placeholder="أضف ملاحظة إن وجدت..."
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                          rows="2"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 md:space-x-reverse">
                          <button
                            onClick={() => handleApproveTask(task.id)}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                          >
                            قبول المهمة
                          </button>
                          <button
                            onClick={() => openRejectModal(task)}
                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                          >
                            رفض المهمة
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد مهام في انتظار الموافقة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reject Confirmation Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-right">
                <h3 className="text-lg font-bold mb-2">رفض المهمة</h3>
                <p className="text-gray-600 mb-4">
                  هل أنت متأكد أنك تريد رفض المهمة "<strong>{taskToReject?.name}</strong>"؟
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة المسؤول (اختياري)</label>
                  <textarea
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="اذكر أسباب الرفض أو ملاحظاتك..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 space-x-reverse">
                  <button
                    onClick={closeRejectModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleRejectTask(taskToReject?.id)}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  >
                    تأكيد الرفض
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ValidationPage;