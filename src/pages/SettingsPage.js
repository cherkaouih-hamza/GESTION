import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  // Mock system settings data
  const [settings, setSettings] = useState({
    general: {
      systemName: 'نظام المتابعة',
      systemDescription: 'نظام لإدارة وتتبع المهام',
      timezone: 'Africa/Casablanca',
      language: 'ar',
      dateFormat: 'DD/MM/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      dueDateReminders: true,
      reminderHours: 24
    },
    security: {
      passwordComplexity: true,
      sessionTimeout: 30,
      twoFactorAuth: false
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = (section) => {
    // In a real app, this would save to the backend
    console.log(`Saved ${section} settings:`, settings[section]);
    alert(`تم حفظ إعدادات ${section} بنجاح!`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-blue-600 rounded-full ml-3"></div>
          <h3 className="text-xl font-semibold text-gray-800">الإعدادات العامة</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">اسم النظام</label>
            <div className="relative">
              <input
                type="text"
                value={settings.general.systemName}
                onChange={(e) => handleInputChange('general', 'systemName', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-3 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">وصف النظام</label>
            <div className="relative">
              <textarea
                value={settings.general.systemDescription}
                onChange={(e) => handleInputChange('general', 'systemDescription', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-3 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">المنطقة الزمنية</label>
              <div className="relative">
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="Africa/Casablanca">الدار البيضاء</option>
                  <option value="Europe/Paris">باريس</option>
                  <option value="UTC">UTC</option>
                </select>
                <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">اللغة</label>
              <div className="relative">
                <select
                  value={settings.general.language}
                  onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="ar">العربية</option>
                  <option value="fr">الفرنسية</option>
                  <option value="en">الإنجليزية</option>
                </select>
                <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">تنسيق التاريخ</label>
            <div className="relative">
              <select
                value={settings.general.dateFormat}
                onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
              <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => handleSaveSettings('general')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            حفظ الإعدادات العامة
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-purple-600 rounded-full ml-3"></div>
          <h3 className="text-xl font-semibold text-gray-800">إعدادات الإشعارات</h3>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <label className="text-base font-medium text-gray-800">إشعارات البريد الإلكتروني</label>
                </div>
                <p className="text-sm text-gray-500 mr-9 mt-2">السماح بإرسال إشعارات عبر البريد الإلكتروني</p>
              </div>
              <button
                onClick={() => handleInputChange('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.emailNotifications ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <label className="text-base font-medium text-gray-800">إشعارات الدفع</label>
                </div>
                <p className="text-sm text-gray-500 mr-9 mt-2">السماح بإرسال إشعارات دفع للهاتف</p>
              </div>
              <button
                onClick={() => handleInputChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.pushNotifications ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <label className="text-base font-medium text-gray-800">تذكيرات انتهاء المهلة</label>
                </div>
                <p className="text-sm text-gray-500 mr-9 mt-2">إرسال تذكيرات قبل انتهاء مهلة المهمة</p>
              </div>
              <button
                onClick={() => handleInputChange('notifications', 'dueDateReminders', !settings.notifications.dueDateReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.dueDateReminders ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.notifications.dueDateReminders ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-purple-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <label className="text-base font-medium text-gray-800">عدد الساعات للتذكير</label>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="number"
                  value={settings.notifications.reminderHours}
                  onChange={(e) => handleInputChange('notifications', 'reminderHours', parseInt(e.target.value))}
                  className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  min="1"
                  max="168"
                />
                <span className="mr-4 text-gray-500">ساعة</span>
              </div>
              <p className="text-sm text-gray-500 mr-9 mt-2">عدد الساعات قبل انتهاء المهلة</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => handleSaveSettings('notifications')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            حفظ إعدادات الإشعارات
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-red-600 rounded-full ml-3"></div>
          <h3 className="text-xl font-semibold text-gray-800">إعدادات الأمان</h3>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <label className="text-base font-medium text-gray-800">تعقيد كلمة المرور</label>
                </div>
                <p className="text-sm text-gray-500 mr-9 mt-2">تطبيق قواعد تعقيد كلمة المرور</p>
              </div>
              <button
                onClick={() => handleInputChange('security', 'passwordComplexity', !settings.security.passwordComplexity)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.passwordComplexity ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.security.passwordComplexity ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <label className="text-base font-medium text-gray-800">مهلة الجلسة (بالدقائق)</label>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  min="5"
                  max="120"
                />
                <span className="mr-4 text-gray-500">دقيقة</span>
              </div>
              <p className="text-sm text-gray-500 mr-9 mt-2">عدد الدقائق قبل انتهاء الجلسة تلقائيًا</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <label className="text-base font-medium text-gray-800">المصادقة الثنائية</label>
                </div>
                <p className="text-sm text-gray-500 mr-9 mt-2">تمكين المصادقة الثنائية للحسابات</p>
              </div>
              <button
                onClick={() => handleInputChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.twoFactorAuth ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => handleSaveSettings('security')}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            حفظ إعدادات الأمان
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemInfo = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-green-600 rounded-full ml-3"></div>
          <h3 className="text-xl font-semibold text-gray-800">معلومات النظام</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">إصدار النظام</h4>
                <p className="text-xl font-bold text-gray-800">1.0.0</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">عدد المستخدمين</h4>
                <p className="text-xl font-bold text-gray-800">25</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">عدد المهام</h4>
                <p className="text-xl font-bold text-gray-800">142</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">الاستخدام</h4>
                <p className="text-xl font-bold text-gray-800">3.2 GB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            إنشاء نسخة احتياطية
          </button>
          <button className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
            تفريغ ذاكرة التخزين المؤقت
          </button>
        </div>
      </div>
    </div>
  );
  // Fonction pour le rendu du test de base de données
  const renderDatabaseTest = () => {
    const [testResults, setTestResults] = React.useState(null);
    const [isTesting, setIsTesting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [taskId, setTaskId] = React.useState(null);

    const testDatabaseConnection = async () => {
      setIsTesting(true);
      setError(null);

      try {
        // Test de connexion à la base de données via l'API
        const response = await fetch('/api/test-db-connection');

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setTestResults(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du test de connexion:', err);
      } finally {
        setIsTesting(false);
      }
    };

    const testApiConnection = async () => {
      setIsTesting(true);
      setError(null);

      try {
        // Test de connexion à l'API
        const response = await fetch('/api/health');

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        setTestResults({ api: { status: 'OK', ...data } });
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du test API:', err);
      } finally {
        setIsTesting(false);
      }
    };

    const testCreateTask = async () => {
      setIsTesting(true);
      setError(null);

      try {
        // Test de création d'une tâche
        const taskData = {
          title: 'Test de tâche - ' + new Date().toISOString(),
          description: 'Tâche de test créée depuis la page de test',
          status: 'pending',
          priority: 'medium',
          pole: 'technique',
          assignee: 'admin',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Une semaine à partir de maintenant
          created_by: 'admin'
        };

        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`${response.status}: ${errorData.error || 'Erreur inconnue'}`);
        }

        const data = await response.json();
        setTaskId(data.id || data.id);
        setTestResults({
          message: 'Tâche créée avec succès',
          task: data,
          ...testResults
        });
      } catch (err) {
        setError(`Erreur lors de la création de la tâche: ${err.message}`);
        console.error('Erreur lors de la création de la tâche:', err);
      } finally {
        setIsTesting(false);
      }
    };

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">اختبار قاعدة البيانات</h3>
          </div>

          <div className="test-controls space-x-4 space-y-4 mb-6">
            <button
              onClick={testDatabaseConnection}
              disabled={isTesting}
              className="test-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isTesting ? 'Test en cours...' : 'Tester la connexion DB'}
            </button>

            <button
              onClick={testApiConnection}
              disabled={isTesting}
              className="test-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isTesting ? 'Test en cours...' : 'Tester la connexion API'}
            </button>

            <button
              onClick={testCreateTask}
              disabled={isTesting}
              className="test-button bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isTesting ? 'Création en cours...' : 'Tester l\'ajout de tâche'}
            </button>
          </div>

          {error && (
            <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <h3 className="font-bold">Erreur:</h3>
              <p>{error}</p>
            </div>
          )}

          {testResults && (
            <div className="results-container bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-gray-800">Résultats du test:</h3>
              <pre className="text-sm text-gray-700 bg-white p-2 rounded overflow-auto">{JSON.stringify(testResults, null, 2)}</pre>
            </div>
          )}

          {taskId && (
            <div className="success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <h3 className="font-bold">Tâche créée avec succès!</h3>
              <p>ID de la tâche: {taskId}</p>
            </div>
          )}

          <div className="info-section bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800">Informations importantes:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1 mt-2">
              <li>Assurez-vous que la variable DATABASE_URL est correctement configurée dans Vercel</li>
              <li>Les tests vérifient la connexion entre le backend Vercel et la base de données PostgreSQL</li>
              <li>Si les tests échouent, vérifiez les logs Vercel pour plus de détails</li>
              <li>Le test d'ajout de tâche vérifie la fonctionnalité complète d'écriture dans la base de données</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 settings-page">
        <div className="settings-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">إعدادات النظام</h1>
          <p className="text-right opacity-90">إدارة إعدادات النظام وتخصيصه</p>
        </div>

        {/* Tabs Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('general')}
            className={`tab-item ${activeTab === 'general' ? 'active' : ''}`}
          >
            الإعدادات العامة
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`tab-item ${activeTab === 'notifications' ? 'active' : ''}`}
          >
            الإشعارات
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`tab-item ${activeTab === 'security' ? 'active' : ''}`}
          >
            الأمان
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`tab-item ${activeTab === 'info' ? 'active' : ''}`}
          >
            معلومات النظام
          </button>
          <button
            onClick={() => setActiveTab('database-test')}
            className={`tab-item ${activeTab === 'database-test' ? 'active' : ''}`}
          >
            اختبار قاعدة البيانات
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'info' && renderSystemInfo()}
        {activeTab === 'database-test' && renderDatabaseTest()}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;