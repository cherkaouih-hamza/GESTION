import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">الإعدادات العامة</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم النظام</label>
            <input
              type="text"
              value={settings.general.systemName}
              onChange={(e) => handleInputChange('general', 'systemName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف النظام</label>
            <textarea
              value={settings.general.systemDescription}
              onChange={(e) => handleInputChange('general', 'systemDescription', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة الزمنية</label>
              <select
                value={settings.general.timezone}
                onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Africa/Casablanca">الدار البيضاء</option>
                <option value="Europe/Paris">باريس</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اللغة</label>
              <select
                value={settings.general.language}
                onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ar">العربية</option>
                <option value="fr">الفرنسية</option>
                <option value="en">الإنجليزية</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تنسيق التاريخ</label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSaveSettings('general')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            حفظ الإعدادات العامة
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الإشعارات</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">إشعارات البريد الإلكتروني</label>
              <p className="text-sm text-gray-500">السماح بإرسال إشعارات عبر البريد الإلكتروني</p>
            </div>
            <button
              onClick={() => handleInputChange('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">إشعارات الدفع</label>
              <p className="text-sm text-gray-500">السماح بإرسال إشعارات دفع للهاتف</p>
            </div>
            <button
              onClick={() => handleInputChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">تذكيرات انتهاء المهلة</label>
              <p className="text-sm text-gray-500">إرسال تذكيرات قبل انتهاء مهلة المهمة</p>
            </div>
            <button
              onClick={() => handleInputChange('notifications', 'dueDateReminders', !settings.notifications.dueDateReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.notifications.dueDateReminders ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.notifications.dueDateReminders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الساعات للتذكير</label>
            <input
              type="number"
              value={settings.notifications.reminderHours}
              onChange={(e) => handleInputChange('notifications', 'reminderHours', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="168"
            />
            <p className="text-sm text-gray-500 mt-1">عدد الساعات قبل انتهاء المهلة</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSaveSettings('notifications')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            حفظ إعدادات الإشعارات
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الأمان</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">تعقيد كلمة المرور</label>
              <p className="text-sm text-gray-500">تطبيق قواعد تعقيد كلمة المرور</p>
            </div>
            <button
              onClick={() => handleInputChange('security', 'passwordComplexity', !settings.security.passwordComplexity)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.security.passwordComplexity ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.security.passwordComplexity ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مهلة الجلسة (بالدقائق)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="120"
            />
            <p className="text-sm text-gray-500 mt-1">عدد الدقائق قبل انتهاء الجلسة تلقائيًا</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">المصادقة الثنائية</label>
              <p className="text-sm text-gray-500">تمكين المصادقة الثنائية للحسابات</p>
            </div>
            <button
              onClick={() => handleInputChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => handleSaveSettings('security')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            حفظ إعدادات الأمان
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات النظام</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700">إصدار النظام</h4>
            <p className="text-lg font-semibold">1.0.0</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700">عدد المستخدمين</h4>
            <p className="text-lg font-semibold">25</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700">عدد المهام</h4>
            <p className="text-lg font-semibold">142</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700">الاستخدام</h4>
            <p className="text-lg font-semibold">3.2 GB</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            إنشاء نسخة احتياطية
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2">
            تفريغ ذاكرة التخزين المؤقت
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">إعدادات النظام</h1>
        <p className="text-gray-600">إدارة إعدادات النظام وتخصيصه</p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الإعدادات العامة
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الإشعارات
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الأمان
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            معلومات النظام
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'notifications' && renderNotificationSettings()}
      {activeTab === 'security' && renderSecuritySettings()}
      {activeTab === 'info' && renderSystemInfo()}
    </div>
  );
};

export default SettingsPage;