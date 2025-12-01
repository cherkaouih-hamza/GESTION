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
    <div className="stat-card">
      <div className="stat-card-content">
        <div className={`stat-card-icon ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
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
    <div className="chart-section">
      <div className="chart-section-header">
        <div className="chart-section-header-line"></div>
        <h3 className="chart-section-title">توزيع المهام حسب النوع</h3>
      </div>
      <div className="space-y-3">
        {types.map((type, index) => (
          <div key={type} className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(counts[index] / tasks.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-bar-label">{type}</span>
            <span className="progress-bar-count">{counts[index]}</span>
          </div>
        ))}
        {types.length === 0 && (
          <div className="empty-state">
            <p className="text-gray-500">لا توجد مهام</p>
          </div>
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
      <div className="py-6 px-4 sm:px-6 lg:px-8 dashboard-page">
        <div className="dashboard-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">
            مرحبًا، {currentUser?.name}
          </h1>
          <p className="text-right opacity-90">
            {currentUser?.role === 'admin'
              ? 'أنت تستخدم حساب المدير'
              : currentUser?.role === 'responsable'
              ? 'أنت تستخدم حساب المسؤول'
              : 'أنت تستخدم حساب المستخدم'}
          </p>
        </div>

        <div className="stats-cards">
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

          <div className="next-deadline-section">
            <div className="next-deadline-header">
              <div className="next-deadline-header-line"></div>
              <h3 className="next-deadline-title">أقرب مهلة</h3>
            </div>
            {nextDeadline ? (
              <div className="deadline-item">
                <p className="deadline-name">{nextDeadline.name}</p>
                <p className="deadline-type">النوع: {nextDeadline.type}</p>
                <p className="deadline-date">تاريخ الانتهاء: {new Date(nextDeadline.endDate).toLocaleDateString('ar-MA')}</p>
                <p className="deadline-status">
                  {nextDeadline.status}
                </p>
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-gray-500">لا توجد مهام مجدولة</p>
              </div>
            )}
          </div>
        </div>

        {/* User-specific dashboard for utilisateur role */}
        {currentUser?.role === 'utilisateur' && (
          <div className="user-dashboard">
            <div className="user-dashboard-header">
              <div className="user-dashboard-header-line"></div>
              <h3 className="user-dashboard-title">لوحة تحكم المستخدم</h3>
            </div>
            <div className="user-stats-grid">
              <div className="user-stat-item">
                <p className="user-stat-value">{userTasks.filter(t => t.status === 'جارية').length}</p>
                <p className="user-stat-label">مهامك الجارية</p>
              </div>
              <div className="user-stat-item">
                <p className="user-stat-value">{userTasks.filter(t => t.status === 'مكتملة').length}</p>
                <p className="user-stat-label">مهامك المكتملة</p>
              </div>
              <div className="user-stat-item">
                <p className="user-stat-value">{userTasks.filter(t => t.status === 'في انتظار الموافقة').length}</p>
                <p className="user-stat-label">في انتظار الموافقة</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;