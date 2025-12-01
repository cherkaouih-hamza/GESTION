import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import DashboardLayout from '../components/DashboardLayout';
import TaskForm from '../components/TaskForm';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/TasksPage.css';

const TasksPage = () => {
  const { currentUser, getAllTasks, getTasksByUser, createTask, updateTask, deleteTask } = useAuth();
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [poleFilter, setPoleFilter] = useState(''); // Adding the new Pôle filter
  const [userAssignedFilter, setUserAssignedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    let allTasks = [];
    
    if (currentUser?.role === 'utilisateur') {
      allTasks = getTasksByUser(currentUser.id);
    } else {
      allTasks = getAllTasks();
    }
    
    setTasks(allTasks);
    setFilteredTasks(allTasks);
  }, [currentUser, getAllTasks, getTasksByUser]);

  useEffect(() => {
    let result = tasks;

    // Apply status filter
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter(task => task.type === typeFilter);
    }

    // Apply pole filter
    if (poleFilter) {
      result = result.filter(task => task.pole === poleFilter);
    }

    // Apply user assigned filter
    if (userAssignedFilter) {
      result = result.filter(task => task.assignedTo === userAssignedFilter);
    }

    // Apply date filters
    if (dateFrom) {
      result = result.filter(task => new Date(task.startDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      result = result.filter(task => new Date(task.endDate) <= new Date(dateTo));
    }

    // Apply search query
    if (searchQuery) {
      result = result.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [tasks, statusFilter, typeFilter, poleFilter, userAssignedFilter, dateFrom, dateTo, searchQuery]);

  // Function to get user name by ID
  const getUserNameById = (userId) => {
    // This would typically come from the user context or API
    const users = {
      'user1': 'محمد أحمد',
      'user2': 'فاطمة الزهرة',
      'user3': 'علي حسن',
      'user4': 'نور الهدى'
    };
    return users[userId] || userId;
  };

  const handleCreateTask = (taskData) => {
    const newTask = createTask(taskData);
    setTasks([...tasks, newTask]);

    // Send notification if task is urgent or assigned to another user
    if (newTask.priority === 'Urgent') {
      addNotification({
        title: 'مهمة عاجلة جديدة',
        message: `تم إنشاء مهمة عاجلة: ${newTask.name}`,
        type: 'urgent',
        userId: newTask.assignedTo || null
      });
    } else if (newTask.assignedTo && newTask.assignedTo !== currentUser?.id) {
      addNotification({
        title: 'مهمة جديدة تم تعيينها لك',
        message: `تم تعيين المهمة "${newTask.name}" لك`,
        type: 'assignment',
        userId: newTask.assignedTo
      });
    }

    setShowForm(false);
  };

  const handleUpdateTask = (taskId, taskData) => {
    const oldTask = tasks.find(task => task.id === taskId);
    updateTask(taskId, taskData);
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...taskData } : task
    ));

    // Send notification if task becomes urgent or is reassigned
    const updatedTask = { ...oldTask, ...taskData };
    if (updatedTask.priority === 'Urgent' && oldTask.priority !== 'Urgent') {
      addNotification({
        title: 'مهمة أصبحت عاجلة',
        message: `أصبحت المهمة "${updatedTask.name}" عاجلة`,
        type: 'urgent',
        userId: updatedTask.assignedTo || null
      });
    } else if (updatedTask.assignedTo && updatedTask.assignedTo !== oldTask.assignedTo) {
      addNotification({
        title: 'تم تعيينك لمهمة',
        message: `تم تعيينك لمهمة جديدة: "${updatedTask.name}"`,
        type: 'assignment',
        userId: updatedTask.assignedTo
      });
    }

    setCurrentTask(null);
    setShowForm(false);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  const handleConfirmDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const canModifyTask = (task) => {
    // User can only modify their own tasks that are not yet validated
    if (currentUser?.role === 'utilisateur') {
      return task.createdBy === currentUser.id && 
             (task.status === 'في انتظار الموافقة' || task.status === 'مسودة');
    }
    // Admin and responsable can always modify tasks
    return currentUser?.role === 'admin' || currentUser?.role === 'responsable';
  };

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 tasks-page">
        <div className="tasks-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">متابعة المهام</h1>
          <p className="text-right opacity-90">قائمة المهام وحالتها الحالية</p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setCurrentTask(null);
              setShowForm(true);
            }}
            className="create-task-btn"
          >
            + إنشاء مهمة
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <h2 className="text-xl font-semibold text-right mb-4">تصفية المهام</h2>
          <div className="filter-group">
            <div className="filter-item">
              <label className="text-right">حالة المهمة</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full"
              >
                <option value="">الكل</option>
                <option value="مسودة">مسودة</option>
                <option value="في انتظار الموافقة">في انتظار الموافقة</option>
                <option value="جارية">جارية</option>
                <option value="مكتملة">مكتملة</option>
                <option value="مرفوضة">مرفوضة</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="text-right">نوع المهمة</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full"
              >
                <option value="">الكل</option>
                <option value="فيديو">فيديو</option>
                <option value="بطاقة">بطاقة</option>
                <option value="إعلان">إعلان</option>
                <option value="صوتي">صوتي</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="text-right">القطب</label>
              <select
                value={poleFilter}
                onChange={(e) => setPoleFilter(e.target.value)}
                className="w-full"
              >
                <option value="">الكل</option>
                <option value="التقنية">التقنية</option>
                <option value="الإعلام">الإعلام</option>
                <option value="ال Pedagogical">ال Pedagogical</option>
                <option value="الإدارية">الإدارية</option>
                <option value="ال Pedagogique">ال Pedagogique</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="text-right">المستخدم المكلف</label>
              <select
                value={userAssignedFilter}
                onChange={(e) => setUserAssignedFilter(e.target.value)}
                className="w-full"
              >
                <option value="">الكل</option>
                <option value="user1">محمد أحمد</option>
                <option value="user2">فاطمة الزهرة</option>
                <option value="user3">علي حسن</option>
                <option value="user4">نور الهدى</option>
              </select>
            </div>
          </div>

          <div className="filter-group mt-4">
            <div className="filter-item">
              <label className="text-right">من تاريخ</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="filter-item">
              <label className="text-right">إلى تاريخ</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="filter-item">
              <label className="text-right">البحث</label>
              <input
                type="text"
                placeholder="البحث في أسماء المهام ووصفها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-table-container">
          <div className="overflow-x-auto">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th scope="col" className="text-right">
                    اسم المهمة
                  </th>
                  <th scope="col" className="text-right">
                    نوع المهمة
                  </th>
                  <th scope="col" className="text-right">
                    القطب
                  </th>
                  <th scope="col" className="text-right">
                    الأولوية
                  </th>
                  <th scope="col" className="text-right">
                    المستخدم المكلف
                  </th>
                  <th scope="col" className="text-right">
                    الحالة
                  </th>
                  <th scope="col" className="text-right">
                    التواريخ
                  </th>
                  <th scope="col" className="text-right">
                    رابط الوسائط
                  </th>
                  <th scope="col" className="text-right">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="text-right">
                        <div className="font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                      </td>
                      <td className="text-sm text-gray-500 text-right">
                        {task.type}
                      </td>
                      <td className="text-sm text-gray-500 text-right">
                        {task.pole || 'غير محدد'}
                      </td>
                      <td className="text-right">
                        <span className={`priority-badge ${
                          task.priority === 'Urgent' ? 'priority-urgent' :
                          task.priority === 'Important' ? 'priority-important' :
                          task.priority === 'Normal' ? 'priority-normal' :
                          task.priority === 'Faible' ? 'priority-faible' : 'priority-normal'
                        }`}>
                          {task.priority === 'Urgent' ? '⚠️ عاجل' :
                           task.priority === 'Important' ? 'مهم' :
                           task.priority === 'Normal' ? 'عادي' :
                           task.priority === 'Faible' ? 'ضعيفة' : task.priority}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500 text-right">
                        {task.assignedTo ? (
                          <span className="user-badge">
                            {getUserNameById(task.assignedTo)}
                          </span>
                        ) : (
                          <span className="user-badge">
                            غير معين
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <span className={`status-badge ${
                          task.status === 'جارية' ? 'status-in-progress' :
                          task.status === 'مكتملة' ? 'status-completed' :
                          task.status === 'في انتظار الموافقة' ? 'status-pending' :
                          task.status === 'مرفوضة' ? 'status-rejected' :
                          task.status === 'مسودة' ? 'status-draft' : 'status-draft'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500 text-right">
                        {new Date(task.startDate).toLocaleDateString('ar-MA')} - {new Date(task.endDate).toLocaleDateString('ar-MA')}
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
                        <div className="flex space-x-2 space-x-reverse">
                          {canModifyTask(task) && (
                            <button
                              onClick={() => handleEditTask(task)}
                              className="action-btn edit-btn"
                            >
                              تعديل
                            </button>
                          )}
                          <button
                            onClick={() => handleConfirmDelete(task)}
                            className="action-btn delete-btn"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-gray-500 py-12">
                      <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3 className="text-lg font-medium">لا توجد مهام</h3>
                        <p className="mt-1">لا توجد مهام تطابق المعايير المحددة</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className="task-form-modal">
            <div className="task-form-modal-content">
              <div className="task-form-header">
                <h3 className="text-xl font-bold text-right">
                  {currentTask ? 'تعديل مهمة' : 'إنشاء مهمة جديدة'}
                </h3>
              </div>
              <div className="task-form-body">
                <TaskForm
                  task={currentTask}
                  onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
                  onCancel={() => {
                    setShowForm(false);
                    setCurrentTask(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <ConfirmationModal
            title="تأكيد الحذف"
            message={`هل أنت متأكد أنك تريد حذف المهمة "${taskToDelete?.name}"؟`}
            onConfirm={() => handleDeleteTask(taskToDelete?.id)}
            onCancel={() => {
              setShowDeleteModal(false);
              setTaskToDelete(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;