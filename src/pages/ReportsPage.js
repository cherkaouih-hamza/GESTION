import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
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
    <div className="p-6" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">تقرير المهام</h1>
        <p className="text-gray-600">عرض تحليلي لحالة المهام حسب التاريخ والقطب</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">مرشحات التقرير</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">القطب</label>
            <select
              value={selectedPole}
              onChange={(e) => setSelectedPole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {poles.map((pole) => (
                <option key={pole.value} value={pole.value}>
                  {pole.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end space-x-2 space-x-reverse">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              تطبيق التصفية
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">إجمالي المهام</h3>
          <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">منتهية</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">معلقة</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">قيد التنفيذ</h3>
          <p className="text-3xl font-bold text-blue-500">{inProgressTasks}</p>
        </div>
      </div>

      {/* Charts Section */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">جاري تحميل التقرير...</p>
        </div>
      )}

      {!loading && reportData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">توزيع المهام حسب الحالة</h3>
            <Pie data={reportData.status} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>

          {/* Type Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">توزيع المهام حسب النوع</h3>
            <Pie data={reportData.type} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>

          {/* Pole Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">توزيع المهام حسب القطب</h3>
            <Pie data={reportData.pole} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">يرجى تطبيق المرشحات لعرض التقرير</p>
          </div>
        )
      )}
    </div>
  );
};

export default ReportsPage;