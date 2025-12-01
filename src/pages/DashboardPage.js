import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/DashboardPage.css';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
          {icon}
        </div>
        <div className="mr-4 text-right">
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const TaskTypeChart = ({ tasks }) => {
  const typeCounts = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {});

  const types = Object.keys(typeCounts);
  const counts = Object.values(typeCounts);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold mb-4 text-right">توزيع المهام حسب النوع</h3>
      <div className="space-y-3">
        {types.map((type, index) => (
          <div key={type} className="flex items-center justify-between">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(counts[index] / tasks.length) * 100}%` }}
              ></div>
            </div>
            <span className="mr-3 text-sm">{type}</span>
            <span className="text-sm font-medium">{counts[index]}</span>
          </div>
        ))}
        {types.length === 0 && (
          <p className="text-gray-500 text-center py-4">لا توجد مهام</p>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { currentUser, getAllTasks, getTasksByUser, getTasksForValidation } = useAuth();
  
  let allTasks = getAllTasks();
  let userTasks = [];

  if (currentUser?.role === 'utilisateur') {
    userTasks = getTasksByUser(currentUser.id);
    allTasks = userTasks;
  } else if (currentUser?.role === 'responsable') {
    // For this demo, responsable sees tasks from their team
    userTasks = allTasks.filter(task => task.createdBy === currentUser.id || task.assignedTo === currentUser.id);
  }

  // Calculate stats based on role
  const stats = {
    activeTasks: allTasks.filter(task => task.status === 'جارية').length,
    completedTasks: allTasks.filter(task => task.status === 'مكتملة').length,
    pendingTasks: allTasks.filter(task => task.status === 'في انتظار الموافقة').length,
    inactiveTasks: allTasks.filter(task => !task.isActive).length,
  };

  // Add user stats if admin
  if (currentUser?.role === 'admin') {
    stats.totalUsers = 3; // mock data
    stats.inactiveUsers = 0; // mock data
  }

  // Find next deadline
  const sortedTasks = [...allTasks].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  const nextDeadline = sortedTasks.length > 0 ? sortedTasks[0] : null;

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 text-right">
            مرحبًا، {currentUser?.name}
          </h1>
          <p className="text-gray-600 text-right mt-1">
            {currentUser?.role === 'admin' 
              ? 'أنت تستخدم حساب المدير' 
              : currentUser?.role === 'responsable'
              ? 'أنت تستخدم حساب المسؤول'
              : 'أنت تستخدم حساب المستخدم'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard 
            title="عدد المهام الجارية" 
            value={stats.activeTasks} 
            icon="🔄" 
            color="blue"
          />
          <StatCard 
            title="عدد المهام المكتملة" 
            value={stats.completedTasks} 
            icon="✅" 
            color="green"
          />
          <StatCard 
            title="المهام في انتظار الموافقة" 
            value={stats.pendingTasks} 
            icon="⏳" 
            color="yellow"
          />
          
          {currentUser?.role === 'admin' && (
            <>
              <StatCard 
                title="عدد المستخدمين" 
                value={stats.totalUsers} 
                icon="👥" 
                color="purple"
              />
              <StatCard 
                title="المستخدمين غير النشطين" 
                value={stats.inactiveUsers} 
                icon="👤" 
                color="red"
              />
            </>
          )}
          
          <StatCard 
            title="المهام غير النشطة" 
            value={stats.inactiveTasks} 
            icon="❌" 
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskTypeChart tasks={allTasks} />
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-right">أقرب مهلة</h3>
            {nextDeadline ? (
              <div className="text-right">
                <p className="font-medium">{nextDeadline.name}</p>
                <p className="text-gray-600 mt-1">النوع: {nextDeadline.type}</p>
                <p className="text-gray-600">تاريخ الانتهاء: {new Date(nextDeadline.endDate).toLocaleDateString('ar-MA')}</p>
                <p className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded inline-block">
                  {nextDeadline.status}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">لا توجد مهام مجدولة</p>
            )}
          </div>
        </div>

        {/* User-specific dashboard for utilisateur role */}
        {currentUser?.role === 'utilisateur' && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-right">لوحة تحكم المستخدم</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold">{userTasks.filter(t => t.status === 'جارية').length}</p>
                <p className="text-gray-600">مهامك الجارية</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold">{userTasks.filter(t => t.status === 'مكتملة').length}</p>
                <p className="text-gray-600">مهامك المكتملة</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold">{userTasks.filter(t => t.status === 'في انتظار الموافقة').length}</p>
                <p className="text-gray-600">في انتظار الموافقة</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;