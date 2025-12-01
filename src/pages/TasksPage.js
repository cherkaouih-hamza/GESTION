import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import TaskForm from '../components/TaskForm';
import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/TasksPage.css';

const TasksPage = () => {
  const { currentUser, getAllTasks, getTasksByUser, createTask, updateTask, deleteTask } = useAuth();
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
  }, [tasks, statusFilter, typeFilter, poleFilter, dateFrom, dateTo, searchQuery]);

  const handleCreateTask = (taskData) => {
    const newTask = createTask(taskData);
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  const handleUpdateTask = (taskId, taskData) => {
    updateTask(taskId, taskData);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
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
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 text-right">متابعة المهام</h1>
            <p className="text-gray-600 text-right">قائمة المهام وحالتها الحالية</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setCurrentTask(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <span className="ml-2">+ إنشاء مهمة</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">حالة المهمة</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">الكل</option>
                <option value="مسودة">مسودة</option>
                <option value="في انتظار الموافقة">في انتظار الموافقة</option>
                <option value="جارية">جارية</option>
                <option value="مكتملة">مكتملة</option>
                <option value="مرفوضة">مرفوضة</option>
              </select>
            </div>

            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع المهمة</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">الكل</option>
                <option value="فيديو">فيديو</option>
                <option value="بطاقة">بطاقة</option>
                <option value="إعلان">إعلان</option>
                <option value="صوتي">صوتي</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">القطب</label>
              <select
                value={poleFilter}
                onChange={(e) => setPoleFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">الكل</option>
                <option value="التقنية">التقنية</option>
                <option value="الإعلام">الإعلام</option>
                <option value="ال Pedagogical">ال Pedagogical</option>
                <option value="الإدارية">الإدارية</option>
                <option value="ال Pedagogique">ال Pedagogique</option>
              </select>
            </div>

            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">البحث</label>
              <input
                type="text"
                placeholder="البحث في أسماء المهام ووصفها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
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
                    القطب
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التواريخ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رابط الوسائط
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {task.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {task.pole || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'جارية' ? 'bg-green-100 text-green-800' :
                          task.status === 'مكتملة' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'في انتظار الموافقة' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'مرفوضة' ? 'bg-red-100 text-red-800' :
                          task.status === 'مسودة' ? 'bg-gray-100 text-gray-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {task.status}
                        </span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="flex space-x-2 space-x-reverse">
                          {canModifyTask(task) && (
                            <button
                              onClick={() => handleEditTask(task)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              تعديل
                            </button>
                          )}
                          <button
                            onClick={() => handleConfirmDelete(task)}
                            className="text-red-600 hover:text-red-900"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد مهام
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-bold text-right mb-4">
                  {currentTask ? 'تعديل مهمة' : 'إنشاء مهمة جديدة'}
                </h3>
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