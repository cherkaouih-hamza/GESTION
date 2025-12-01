import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/ValidationPage.css';

const ValidationPage = () => {
  const { currentUser, getTasksForValidation, updateTaskStatus, getAllTasks, getRegistrationRequests, updateRegistrationRequestStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'registrations'
  const [tasks, setTasks] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [itemToProcess, setItemToProcess] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [processingType, setProcessingType] = useState(null); // 'task' or 'registration'

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'tasks') {
        const validationTasks = getTasksForValidation();
        setTasks(validationTasks);
      } else if (activeTab === 'registrations') {
        const registrationRequests = getRegistrationRequests();
        setRegistrations(registrationRequests);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleApprove = async (itemId, type) => {
    try {
      if (type === 'task') {
        updateTaskStatus(itemId, 'جارية', currentUser.id);
        setTasks(tasks.filter(task => task.id !== itemId));
      } else if (type === 'registration') {
        updateRegistrationRequestStatus(itemId, 'approved', currentUser.id);
        setRegistrations(registrations.filter(reg => reg.id !== itemId));
      }
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (itemId, type) => {
    try {
      if (type === 'task') {
        updateTaskStatus(itemId, 'مرفوضة', currentUser.id, rejectionComment);
        setTasks(tasks.filter(task => task.id !== itemId));
      } else if (type === 'registration') {
        updateRegistrationRequestStatus(itemId, 'rejected', currentUser.id, rejectionComment);
        setRegistrations(registrations.filter(reg => reg.id !== itemId));
      }
      setShowRejectModal(false);
      setItemToProcess(null);
      setRejectionComment('');
      setProcessingType(null);
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  const openRejectModal = (item, type) => {
    setItemToProcess(item);
    setProcessingType(type);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setItemToProcess(null);
    setRejectionComment('');
    setProcessingType(null);
  };

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 text-right">صفحة التحقق</h1>
          <p className="text-gray-600 text-right">قائمة المهام وطلبات التسجيل في انتظار الموافقة</p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-end mb-6 border-b border-gray-200">
          <nav className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المهام في الانتظار
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registrations'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              طلبات التسجيل
            </button>
          </nav>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {activeTab === 'tasks' ? tasks.length : registrations.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-gray-600">
              {activeTab === 'tasks' ? 'المهام في الانتظار' : 'طلبات التسجيل'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-2xl font-bold text-green-600">
              {activeTab === 'tasks' ?
                getAllTasks().filter(t => t.status === 'جارية').length :
                registrations.filter(r => r.status === 'approved').length}
            </p>
            <p className="text-gray-600">
              {activeTab === 'tasks' ? 'المهام الجارية' : 'الحسابات المقبولة'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-2xl font-bold text-red-600">
              {activeTab === 'tasks' ?
                getAllTasks().filter(t => t.status === 'مرفوضة').length :
                registrations.filter(r => r.status === 'rejected').length}
            </p>
            <p className="text-gray-600">
              {activeTab === 'tasks' ? 'المهام المرفوضة' : 'الحسابات المرفوضة'}
            </p>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'tasks' ? (
          /* Tasks List */
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
                              onClick={() => handleApprove(task.id, 'task')}
                              className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                            >
                              قبول المهمة
                            </button>
                            <button
                              onClick={() => openRejectModal(task, 'task')}
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
        ) : (
          /* Registrations List */
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التسجيل في
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">{reg.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {reg.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {reg.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {new Date(reg.createdAt).toLocaleDateString('ar-MA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reg.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : reg.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {reg.status === 'pending' ? 'في الانتظار' :
                             reg.status === 'approved' ? 'مقبول' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 md:space-x-reverse">
                            <button
                              onClick={() => handleApprove(reg.id, 'registration')}
                              className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                              disabled={reg.status !== 'pending'}
                            >
                              قبول
                            </button>
                            <button
                              onClick={() => openRejectModal(reg, 'registration')}
                              className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                              disabled={reg.status !== 'pending'}
                            >
                              رفض
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        لا توجد طلبات تسجيل في الانتظار
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reject Confirmation Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-right">
                <h3 className="text-lg font-bold mb-2">
                  {processingType === 'task' ? 'رفض المهمة' : 'رفض طلب التسجيل'}
                </h3>
                <p className="text-gray-600 mb-4">
                  هل أنت متأكد أنك تريد رفض {processingType === 'task' ? 'المهمة' : 'طلب التسجيل'}
                  "<strong>{itemToProcess?.name}</strong>"؟
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة (اختياري)</label>
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
                    onClick={() => handleReject(itemToProcess?.id, processingType)}
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