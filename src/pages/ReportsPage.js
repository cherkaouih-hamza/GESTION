import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/ReportsPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportsPage = () => {
  const { currentUser, getAllTasks } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPole, setSelectedPole] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const hasLoaded = useRef(false);

  const poles = [
    { value: '', label: 'كل الأقطاب' },
    { value: 'التقنية', label: 'التقنية' },
    { value: 'الإعلام', label: 'الإعلام' },
    { value: 'ال Pedagogical', label: 'ال Pedagogical' },
    { value: 'الإدارية', label: 'الإدارية' },
    { value: 'ال Pedagogique', label: 'ال Pedagogique' },
    { value: 'التسويق', label: 'التسويق' },
    { value: 'الموارد البشرية', label: 'الموارد البشرية' },
    { value: 'الإدارة', label: 'الإدارة' },
    { value: 'التحليل', label: 'التحليل' },
    { value: 'الجودة', label: 'الجودة' },
    { value: 'الدعم', label: 'الدعم' },
    { value: 'التكنولوجيا', label: 'التكنولوجيا' },
    { value: 'التصميم', label: 'التصميم' },
    { value: 'التعليم', label: 'التعليم' },
    { value: 'التواصل', label: 'التواصل' },
    { value: 'الإتصال', label: 'الإتصال' },
    { value: 'البحث', label: 'البحث' },
    { value: 'ال.quality', label: 'الجودة' }
  ];

  useEffect(() => {
    // Get tasks from auth context
    const allTasks = getAllTasks();
    setTasks(allTasks);
    if (allTasks.length > 0 && !hasLoaded.current) {
      generateReportData(allTasks);
      hasLoaded.current = true;
    }
  }, [currentUser, getAllTasks]);

  const generateReportData = (tasksToUse = tasks) => {
    // Filter tasks based on date range and pole
    let filteredTasks = tasksToUse;

    if (startDate && endDate) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.startDate || task.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return taskDate >= start && taskDate <= end;
      });
    }

    if (selectedPole) {
      filteredTasks = filteredTasks.filter(task => task.pole === selectedPole);
    }

    // Generate status distribution data
    const statusCounts = filteredTasks.reduce((acc, task) => {
      const statusKey = task.status === 'في انتظار الموافقة' ? 'pending' :
                        task.status === 'جارية' ? 'in_progress' :
                        task.status === 'مكتملة' ? 'completed' :
                        task.status === 'مرفوضة' ? 'rejected' : 'pending';
      acc[statusKey] = (acc[statusKey] || 0) + 1;
      return acc;
    }, {});

    // Generate type distribution data
    const typeCounts = filteredTasks.reduce((acc, task) => {
      const typeKey = task.priority === 'Urgent' ? 'urgent' :
                      task.priority === 'Important' ? 'important' :
                      task.priority === 'Normal' ? 'normal' :
                      task.priority === 'Faible' ? 'low' : 'normal';
      acc[typeKey] = (acc[typeKey] || 0) + 1;
      return acc;
    }, {});

    // Generate pole distribution data
    const poleCounts = filteredTasks.reduce((acc, task) => {
      acc[task.pole] = (acc[task.pole] || 0) + 1;
      return acc;
    }, {});

    setReportData({
      status: {
        labels: ['معلقة', 'قيد التنفيذ', 'منتهية', 'مرفوضة'],
        datasets: [{
          label: 'توزيع المهام حسب الحالة',
          data: [
            statusCounts.pending || 0,
            statusCounts.in_progress || 0,
            statusCounts.completed || 0,
            statusCounts.rejected || 0
          ],
          backgroundColor: [
            '#f97316', // orange for pending
            '#3b82f6', // blue for in_progress
            '#10b981', // green for completed
            '#ef4444'  // red for rejected
          ],
          borderWidth: 1,
        }]
      },
      type: {
        labels: ['عاجل', 'مهم', 'عادي', 'ضعيفة'],
        datasets: [{
          label: 'توزيع المهام حسب الأولوية',
          data: [
            typeCounts.urgent || 0,
            typeCounts.important || 0,
            typeCounts.normal || 0,
            typeCounts.low || 0
          ],
          backgroundColor: [
            '#ef4444', // red for urgent
            '#f59e0b', // amber for important
            '#8b5cf6', // violet for normal
            '#6b7280'  // gray for low
          ],
          borderWidth: 1,
        }]
      },
      pole: {
        labels: Object.keys(poleCounts).filter(pole => pole.trim() !== ''),
        datasets: [{
          label: 'توزيع المهام حسب القطب',
          data: Object.keys(poleCounts)
            .filter(pole => pole.trim() !== '')
            .map(pole => poleCounts[pole]),
          backgroundColor: [
            '#8b5cf6', // violet
            '#06b6d4', // cyan
            '#ec4899', // pink
            '#f59e0b', // amber
            '#10b981', // green
            '#3b82f6', // blue
            '#f97316', // orange
            '#ef4444'  // red
          ].slice(0, Object.keys(poleCounts).length),
          borderWidth: 1,
        }]
      }
    });
  };

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      generateReportData(tasks);
      setLoading(false);
    }, 300); // Small delay for better UX
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPole('');
    setReportData(null);
    generateReportData(tasks);
  };

  // Calculate summary statistics
  const totalTasks = reportData ? reportData.status.datasets[0].data.reduce((a, b) => a + b, 0) : tasks.length;
  const completedTasks = reportData ? reportData.status.datasets[0].data[2] : tasks.filter(t => t.status === 'مكتملة').length;
  const pendingTasks = reportData ? reportData.status.datasets[0].data[0] : tasks.filter(t => t.status === 'في انتظار الموافقة').length;
  const inProgressTasks = reportData ? reportData.status.datasets[0].data[1] : tasks.filter(t => t.status === 'جارية').length;

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 reports-page">
        <div className="reports-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">تقرير المهام</h1>
          <p className="text-right opacity-90">عرض تحليلي لحالة المهام حسب التاريخ والقطب</p>
        </div>

        {/* Filters Section */}
        <div className="reports-filters-section">
          <h2 className="text-xl font-semibold text-right mb-4">مرشحات التقرير</h2>
          <div className="reports-filter-group">
            <div className="reports-filter-item">
              <label className="text-right">من تاريخ</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="reports-filter-item">
              <label className="text-right">إلى تاريخ</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="reports-filter-item">
              <label className="text-right">القطب</label>
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="w-full"
              >
                {poles.map((pole) => (
                  <option key={pole.value} value={pole.value}>
                    {pole.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="action-buttons-container">
              <button
                onClick={handleFilter}
                className="action-btn filter-btn"
              >
                تطبيق التصفية
              </button>
              <button
                onClick={handleReset}
                className="action-btn reset-btn"
              >
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-card-content">
              <div className="summary-card-info">
                <p className="summary-card-title">إجمالي المهام</p>
                <p className="summary-card-value">{totalTasks}</p>
              </div>
              <div className="summary-card-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="summary-card" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
            <div className="summary-card-content">
              <div className="summary-card-info">
                <p className="summary-card-title">منتهية</p>
                <p className="summary-card-value">{completedTasks}</p>
              </div>
              <div className="summary-card-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="summary-card" style={{background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'}}>
            <div className="summary-card-content">
              <div className="summary-card-info">
                <p className="summary-card-title">معلقة</p>
                <p className="summary-card-value">{pendingTasks}</p>
              </div>
              <div className="summary-card-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="summary-card" style={{background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'}}>
            <div className="summary-card-content">
              <div className="summary-card-info">
                <p className="summary-card-title">قيد التنفيذ</p>
                <p className="summary-card-value">{inProgressTasks}</p>
              </div>
              <div className="summary-card-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="text-gray-600">جاري تحميل التقرير...</p>
          </div>
        )}

        {!loading && reportData ? (
          <div className="charts-container">
            {/* Status Distribution Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-header-line"></div>
                <h3 className="chart-card-title">توزيع المهام حسب الحالة</h3>
              </div>
              <div className="chart-container">
                <Pie data={reportData.status} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>

            {/* Type Distribution Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-header-line"></div>
                <h3 className="chart-card-title">توزيع المهام حسب النوع</h3>
              </div>
              <div className="chart-container">
                <Pie data={reportData.type} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>

            {/* Pole Distribution Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-card-header-line"></div>
                <h3 className="chart-card-title">توزيع المهام حسب القطب</h3>
              </div>
              <div className="chart-container">
                <Pie data={reportData.pole} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3 className="empty-state-title">يرجى تطبيق المرشحات لعرض التقرير</h3>
              <p className="empty-state-description">اختر التواريخ والقطب لبدء تحليل المهام</p>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;