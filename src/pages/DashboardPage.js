import React, { useState, useEffect } from 'react';
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
    const type = task.type || task.title || 'غير محدد';
    acc[type] = (acc[type] || 0) + 1;
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
  const { currentUser, getAllTasks, getTasksByUser } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        console.log('Début de la récupération des tâches pour dashboard');

        // Récupérer toutes les tâches
        const allTasksData = await getAllTasks();
        console.log('Tâches récupérées:', allTasksData.length);

        let filteredTasks = allTasksData;

        // Filtrer les tâches selon le rôle de l'utilisateur
        if (currentUser?.role === 'utilisateur' || currentUser?.role === 'responsable') {
          // Pour un utilisateur ou responsable, ne montrer que les tâches assignées ou créées par lui
          // Convertir les IDs en nombres pour la comparaison
          const currentUserIdNum = Number(currentUser.id);
          filteredTasks = allTasksData.filter(task => {
            const createdBy = task.created_by ? Number(task.created_by) : null;
            const assignedTo = task.assignee ? Number(task.assignee) : null;

            return createdBy === currentUserIdNum || assignedTo === currentUserIdNum;
          });
          console.log(`Tâches filtrées pour ${currentUser?.role}:`, filteredTasks.length);
        }

        setAllTasks(filteredTasks);

        // Récupérer spécifiquement les tâches de l'utilisateur
        const userTasksData = await getTasksByUser(currentUser.id);
        setUserTasks(userTasksData);
        console.log('Tâches utilisateur récupérées:', userTasksData.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        // Toujours appeler setLoading(false) même en cas d'erreur
        setAllTasks([]);
        setUserTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchTasks();
    } else {
      // Si pas d'utilisateur connecté, arrêter le chargement
      setLoading(false);
    }
  }, [currentUser, getAllTasks, getTasksByUser]);

  // Calculer les statistiques
  const stats = {
    activeTasks: allTasks.filter(task => 
      task.status === 'in_progress' || task.status === 'جارية'
    ).length,
    completedTasks: allTasks.filter(task => 
      task.status === 'completed' || task.status === 'مكتملة'
    ).length,
    pendingTasks: allTasks.filter(task => 
      task.status === 'pending' || task.status === 'في انتظار الموافقة'
    ).length,
    inactiveTasks: allTasks.filter(task => 
      task.status === 'rejected' || task.status === 'مرفوضة'
    ).length,
  };

  // Ajouter les stats utilisateur si admin
  if (currentUser?.role === 'admin') {
    stats.totalUsers = 3; // données factices pour le moment
    stats.inactiveUsers = 0; // données factices pour le moment
  }

  // Trouver la prochaine échéance
  const sortedTasks = [...allTasks].sort((a, b) => {
    const dateA = new Date(a.end_date || a.endDate);
    const dateB = new Date(b.end_date || b.endDate);
    return dateA - dateB;
  });
  const nextDeadline = sortedTasks.length > 0 ? sortedTasks[0] : null;

  // Stats utilisateur spécifique
  const userStats = {
    activeTasks: userTasks.filter(task => 
      task.status === 'in_progress' || task.status === 'جارية'
    ).length,
    completedTasks: userTasks.filter(task => 
      task.status === 'completed' || task.status === 'مكتملة'
    ).length,
    pendingTasks: userTasks.filter(task => 
      task.status === 'pending' || task.status === 'في انتظار الموافقة'
    ).length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-6 px-4 sm:px-6 lg:px-8 dashboard-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <StatCard
            title="المهام المرفوضة"
            value={stats.inactiveTasks}
            icon="❌"
            color="red"
          />

          {currentUser?.role === 'admin' && (
            <StatCard
              title="عدد المستخدمين"
              value={stats.totalUsers}
              icon="👥"
              color="purple"
            />
          )}
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
                <p className="deadline-name">{nextDeadline.title || nextDeadline.name}</p>
                <p className="deadline-type">النوع: {nextDeadline.type || 'غير محدد'}</p>
                <p className="deadline-date">تاريخ الانتهاء: {new Date(nextDeadline.end_date || nextDeadline.endDate).toLocaleDateString('ar-MA')}</p>
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
                <p className="user-stat-value">{userStats.activeTasks}</p>
                <p className="user-stat-label">مهامك الجارية</p>
              </div>
              <div className="user-stat-item">
                <p className="user-stat-value">{userStats.completedTasks}</p>
                <p className="user-stat-label">مهامك المكتملة</p>
              </div>
              <div className="user-stat-item">
                <p className="user-stat-value">{userStats.pendingTasks}</p>
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