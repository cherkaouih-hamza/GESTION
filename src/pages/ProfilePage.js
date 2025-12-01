import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  const [message, setMessage] = useState('');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || ''
      });
    }
    setMessage('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateUser(currentUser.id, formData);
      setIsEditing(false);
      setMessage('تم تحديث الملف الشخصي بنجاح');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('حدث خطأ أثناء تحديث الملف الشخصي');
    }
  };

  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-right">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 text-right">الملف الشخصي</h1>
              <p className="mt-1 text-sm text-gray-500 text-right">إدارة معلومات حسابك</p>
            </div>
            
            {message && (
              <div className={`px-4 py-3 ${message.includes('نجاح') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} text-right`}>
                {message}
              </div>
            )}
            
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="text-center">
                    <div className="inline-block relative">
                      <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">👤</span>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm px-3 py-2 text-right`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-right">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm px-3 py-2 text-right`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-right">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm px-3 py-2 text-right`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">
                      الدور
                    </label>
                    <div className="mt-1 block w-full bg-gray-50 border-transparent rounded-md px-3 py-2 text-right">
                      {currentUser.role === 'admin' ? 'مدير النظام' : 
                       currentUser.role === 'responsable' ? 'المسؤول' : 'المستخدم'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right">
                      الحالة
                    </label>
                    <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-right ${
                      currentUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {currentUser.isActive ? 'نشط' : 'غير نشط'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        حفظ التغييرات
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      تعديل الملف الشخصي
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Account Security Section */}
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 text-right">أمان الحساب</h2>
              <p className="mt-1 text-sm text-gray-500 text-right">تغيير كلمة المرور وغيرها من الإعدادات</p>
            </div>
            <div className="px-4 py-5 sm:p-6 text-right">
              <p className="text-gray-600 mb-4">ل изменения كلمة المرور أو إعدادات الأمان الأخرى، يرجى الاتصال بالمسؤول.</p>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled
              >
                تغيير كلمة المرور
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;