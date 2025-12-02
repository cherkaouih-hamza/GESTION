import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/taskApi';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/ValidationPage.css';

const ValidationPage = () => {
  const { currentUser, updateTaskStatus, getAllTasks, getRegistrationRequests, updateRegistrationRequestStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'registrations'
  const [tasks, setTasks] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [itemToProcess, setItemToProcess] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [processingType, setProcessingType] = useState(null); // 'task' or 'registration'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'tasks') {
        const allTasksData = await taskApi.getAllTasks();
        setAllTasks(allTasksData);
        // Filtrer les tâches en attente de validation
        const validationTasks = allTasksData.filter(task =>
          task.status === 'pending' || task.status === 'في انتظار الموافقة'
        );
        setTasks(validationTasks);
      } else if (activeTab === 'registrations') {
        // Récupérer les demandes d'inscription
        const registrationRequests = await getRegistrationRequests();
        setRegistrations(registrationRequests);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId, type) => {
    try {
      if (type === 'task') {
        await updateTaskStatus(itemId, 'in_progress', currentUser.id);
        // Mettre à jour la liste locale des tâches en attente
        setTasks(tasks.filter(task => task.id !== itemId));
      } else if (type === 'registration') {
        await updateRegistrationRequestStatus(itemId, 'approved', currentUser.id);
        setRegistrations(registrations.filter(reg => reg.id !== itemId));
      }
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (itemId, type) => {
    try {
      if (type === 'task') {
        await updateTaskStatus(itemId, 'rejected', currentUser.id, rejectionComment);
        setTasks(tasks.filter(task => task.id !== itemId));
      } else if (type === 'registration') {
        await updateRegistrationRequestStatus(itemId, 'rejected', currentUser.id, rejectionComment);
        setRegistrations(registrations.filter(reg => reg.id !== itemId));
      }
    } catch (error) {
      console.error('Error rejecting item:', error);
    } finally {
      setShowRejectModal(false);
      setItemToProcess(null);
      setRejectionComment('');
      setProcessingType(null);
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
      <div className="py-6 px-4 sm:px-6 lg:px-8 validation-page">
        <div className="validation-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">صفحة التحقق</h1>
          <p className="text-right opacity-90">قائمة المهام وطلبات التسجيل في انتظار الموافقة</p>
        </div>

        {/* Tab navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`tab-item ${activeTab === 'tasks' ? 'active' : ''}`}
          >
            المهام في الانتظار
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`tab-item ${activeTab === 'registrations' ? 'active' : ''}`}
          >
            طلبات التسجيل
          </button>
        </div>

        {/* Stats Card */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
          </div>
        ) : (
          <div className="summary-cards">
            <div className="summary-card">
              <p className="summary-card-value pending">
                {activeTab === 'tasks' ? tasks.length : registrations.filter(r => r.status === 'pending').length}
              </p>
              <p className="summary-card-title">
                {activeTab === 'tasks' ? 'المهام في الانتظار' : 'طلبات التسجيل'}
              </p>
            </div>
            <div className="summary-card">
              <p className="summary-card-value approved">
                {activeTab === 'tasks' ?
                  allTasks.filter(t => t.status === 'in_progress' || t.status === 'جارية').length :
                  registrations.filter(r => r.status === 'approved').length}
              </p>
              <p className="summary-card-title">
                {activeTab === 'tasks' ? 'المهام الجارية' : 'الحسابات المقبولة'}
              </p>
            </div>
            <div className="summary-card">
              <p className="summary-card-value rejected">
                {activeTab === 'tasks' ?
                  allTasks.filter(t => t.status === 'rejected' || t.status === 'مرفوضة').length :
                  registrations.filter(r => r.status === 'rejected').length}
              </p>
              <p className="summary-card-title">
                {activeTab === 'tasks' ? 'المهام المرفوضة' : 'الحسابات المرفوضة'}
              </p>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'tasks' ? (
          /* Tasks List */
          <div className="table-container">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="text-right">
                      اسم المهمة
                    </th>
                    <th scope="col" className="text-right">
                      نوع المهمة
                    </th>
                    <th scope="col" className="text-right">
                      المستخدم
                    </th>
                    <th scope="col" className="text-right">
                      التواريخ
                    </th>
                    <th scope="col" className="text-right">
                      رابط الوسائط
                    </th>
                    <th scope="col" className="text-right">
                      الملاحظة
                    </th>
                    <th scope="col" className="text-right">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="text-right">
                          <div className="font-medium text-gray-900">{task.title || task.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                        </td>
                        <td className="text-sm text-gray-500 text-right">
                          {task.type}
                        </td>
                        <td className="text-sm text-gray-500 text-right">
                          {/* Utiliser un mapping pour les utilisateurs ou récupérer depuis l'API */}
                          {task.created_by ? `المستخدم ${task.created_by}` : 'غير معروف'}
                        </td>
                        <td className="text-sm text-gray-500 text-right">
                          {task.start_date || task.startDate ? new Date(task.start_date || task.startDate).toLocaleDateString('ar-MA') : 'غير محدد'} - {task.end_date || task.endDate ? new Date(task.end_date || task.endDate).toLocaleDateString('ar-MA') : 'غير محدد'}
                        </td>
                        <td className="text-right">
                          {task.mediaLink ? (
                            <a
                              href={task.mediaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-800"
                            >
                              عرض
                            </a>
                          ) : (
                            'لا يوجد'
                          )}
                        </td>
                        <td className="text-right">
                          {/* Field for responsables to add comments */}
                          <textarea
                            placeholder="أضف ملاحظة إن وجدت..."
                            className="form-textarea text-sm"
                            rows="2"
                          />
                        </td>
                        <td className="text-right">
                          <div className="flex flex-col md:flex-row md:space-x-2 md:space-x-reverse">
                            <button
                              onClick={() => handleApprove(task.id, 'task')}
                              className="action-btn approve-btn"
                            >
                              قبول المهمة
                            </button>
                            <button
                              onClick={() => openRejectModal(task, 'task')}
                              className="action-btn reject-btn"
                            >
                              رفض المهمة
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="text-lg font-medium">لا توجد مهام</h3>
                        <p className="mt-1">لا توجد مهام في انتظار الموافقة</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Registrations List */
          <div className="table-container">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="text-right">
                      الاسم
                    </th>
                    <th scope="col" className="text-right">
                      البريد الإلكتروني
                    </th>
                    <th scope="col" className="text-right">
                      رقم الهاتف
                    </th>
                    <th scope="col" className="text-right">
                      التسجيل في
                    </th>
                    <th scope="col" className="text-right">
                      الحالة
                    </th>
                    <th scope="col" className="text-right">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td className="text-right">
                          <div className="font-medium text-gray-900">{reg.name}</div>
                        </td>
                        <td className="text-sm text-gray-500 text-right">
                          {reg.email}
                        </td>
                        <td className="text-sm text-gray-500 text-right">
                          {reg.phone}
                        </td>
                        <td className="text-sm text-gray-500 text-right">
                          {new Date(reg.createdAt).toLocaleDateString('ar-MA')}
                        </td>
                        <td className="text-right">
                          <span className={`status-badge ${
                            reg.status === 'pending'
                              ? 'status-pending'
                              : reg.status === 'approved'
                                ? 'status-approved'
                                : 'status-rejected'
                          }`}>
                            {reg.status === 'pending' ? 'في الانتظار' :
                             reg.status === 'approved' ? 'مقبول' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex flex-col md:flex-row md:space-x-2 md:space-x-reverse">
                            <button
                              onClick={() => handleApprove(reg.id, 'registration')}
                              className="action-btn approve-btn"
                              disabled={reg.status !== 'pending'}
                            >
                              قبول
                            </button>
                            <button
                              onClick={() => openRejectModal(reg, 'registration')}
                              className="action-btn reject-btn"
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
                      <td colSpan="6" className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="text-lg font-medium">لا توجد طلبات</h3>
                        <p className="mt-1">لا توجد طلبات تسجيل في الانتظار</p>
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
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="text-xl font-bold">
                  {processingType === 'task' ? 'رفض المهمة' : 'رفض طلب التسجيل'}
                </h3>
              </div>
              <div className="modal-body">
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
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    onClick={closeRejectModal}
                    className="action-btn"
                    style={{backgroundColor: '#e2e8f0', color: '#475569'}}
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleReject(itemToProcess?.id, processingType)}
                    className="action-btn reject-btn"
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