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
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen" dir="rtl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تقرير المهام</h1>
          <p className="text-gray-600">عرض تحليلي لحالة المهام حسب التاريخ والقطب</p>
        </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-blue-600 rounded-full ml-3"></div>
          <h2 className="text-xl font-semibold text-gray-800">مرشحات التقرير</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">من تاريخ</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">إلى تاريخ</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">القطب</label>
            <div className="relative">
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                {poles.map((pole) => (
                  <option key={pole.value} value={pole.value}>
                    {pole.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-end space-x-3 space-x-reverse">
            <button
              onClick={handleFilter}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              تطبيق التصفية
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">إجمالي المهام</p>
              <p className="text-3xl font-bold mt-2">{totalTasks}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm">منتهية</p>
              <p className="text-3xl font-bold mt-2">{completedTasks}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-sm">معلقة</p>
              <p className="text-3xl font-bold mt-2">{pendingTasks}</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-sm">قيد التنفيذ</p>
              <p className="text-3xl font-bold mt-2">{inProgressTasks}</p>
            </div>
            <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {loading && (
        <div className="flex justify-center items-center h-80">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">جاري تحميل التقرير...</p>
          </div>
        </div>
      )}

      {!loading && reportData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-full ml-3"></div>
              <h3 className="text-lg font-semibold text-gray-800">توزيع المهام حسب الحالة</h3>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={reportData.status} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          {/* Type Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-2 h-6 bg-purple-500 rounded-full ml-3"></div>
              <h3 className="text-lg font-semibold text-gray-800">توزيع المهام حسب النوع</h3>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={reportData.type} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          {/* Pole Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center mb-4">
              <div className="w-2 h-6 bg-pink-500 rounded-full ml-3"></div>
              <h3 className="text-lg font-semibold text-gray-800">توزيع المهام حسب القطب</h3>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie data={reportData.pole} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-600 text-lg">يرجى تطبيق المرشحات لعرض التقرير</p>
            <p className="text-gray-500 mt-2">اختر التواريخ والقطب لبدء تحليل المهام</p>
          </div>
        )
      )}
    </div>
    </DashboardLayout>
  );
};

export default ReportsPage;