import React, { useState, useEffect } from 'react';
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
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPole, setSelectedPole] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const poles = [
    { value: '', label: 'كل الأقطاب' },
    { value: 'technique', label: 'تقني' },
    { value: 'media', label: 'اعلامي' },
    { value: 'pedagogical', label: 'تربوي' },
    { value: 'administrative', label: 'إداري' }
  ];

  useEffect(() => {
    // Fetch tasks from API
    fetchTasks();
  }, []);

  useEffect(() => {
    // Generate report data when tasks are loaded
    if (tasks.length > 0 && !reportData) {
      generateReportData();
    }
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate report data
  const generateReportData = () => {
    // Filter tasks based on date range and pole
    let filteredTasks = tasks;

    if (startDate && endDate) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
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
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    // Generate type distribution data
    const typeCounts = filteredTasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {});

    // Generate pole distribution data
    const poleCounts = filteredTasks.reduce((acc, task) => {
      acc[task.pole] = (acc[task.pole] || 0) + 1;
      return acc;
    }, {});

    setReportData({
      status: {
        labels: ['معلقة', 'قيد التنفيذ', 'منتهية'],
        datasets: [{
          label: 'توزيع المهام حسب الحالة',
          data: [
            statusCounts.pending || 0,
            statusCounts.in_progress || 0,
            statusCounts.completed || 0
          ],
          backgroundColor: [
            '#f97316', // orange for pending
            '#3b82f6', // blue for in_progress
            '#10b981'  // green for completed
          ],
          borderWidth: 1,
        }]
      },
      type: {
        labels: ['عاجل', 'مهم', 'عادي'],
        datasets: [{
          label: 'توزيع المهام حسب النوع',
          data: [
            typeCounts.urgent || 0,
            typeCounts.important || 0,
            typeCounts.normal || 0
          ],
          backgroundColor: [
            '#ef4444', // red for urgent
            '#f59e0b', // amber for important
            '#8b5cf6'  // violet for normal
          ],
          borderWidth: 1,
        }]
      },
      pole: {
        labels: ['تقني', 'إعلامي', 'تربوي', 'إداري'],
        datasets: [{
          label: 'توزيع المهام حسب القطب',
          data: [
            poleCounts.technique || 0,
            poleCounts.media || 0,
            poleCounts.pedagogical || 0,
            poleCounts.administrative || 0
          ],
          backgroundColor: [
            '#8b5cf6', // violet
            '#06b6d4', // cyan
            '#ec4899', // pink
            '#f59e0b'  // amber
          ],
          borderWidth: 1,
        }]
      }
    });
  };

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      generateReportData();
      setLoading(false);
    }, 300); // Small delay for better UX
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPole('');
    setReportData(null);
  };

  // Calculate summary statistics
  const totalTasks = reportData ? reportData.status.datasets[0].data.reduce((a, b) => a + b, 0) : tasks.length;
  const completedTasks = reportData ? reportData.status.datasets[0].data[2] : tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = reportData ? reportData.status.datasets[0].data[0] : tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = reportData ? reportData.status.datasets[0].data[1] : tasks.filter(t => t.status === 'in_progress').length;

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