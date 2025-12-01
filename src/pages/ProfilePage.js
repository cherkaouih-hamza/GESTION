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
      <div className="py-6 px-4 sm:px-6 lg:px-8 profile-page">
        <div className="profile-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">الملف الشخصي</h1>
          <p className="text-right opacity-90">إدارة معلومات حسابك</p>
        </div>

        {message && (
          <div className={`message ${message.includes('نجاح') ? 'success' : 'error'} mb-6`}>
            {message}
          </div>
        )}

        <div className="profile-section">
          <div className="profile-section-header">
            <div className="profile-section-header-line"></div>
            <div>
              <h3 className="profile-section-title">معلومات الحساب</h3>
              <p className="profile-section-subtitle">تحديث معلومات حسابك</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="profile-image-container">
                <div className="relative">
                  <div className="profile-image">
                    <span className="profile-image-icon">👤</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      className="profile-image-edit-btn"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  الدور
                </label>
                <div className={`role-badge ${
                  currentUser.role === 'admin'
                    ? 'role-admin'
                    : currentUser.role === 'responsable'
                      ? 'role-responsable'
                      : 'role-utilisateur'
                }`}>
                  {currentUser.role === 'admin' ? 'مدير النظام' :
                   currentUser.role === 'responsable' ? 'المسؤول' : 'المستخدم'}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  الحالة
                </label>
                <div className={`status-badge ${
                  currentUser.isActive ? 'status-active' : 'status-inactive'
                }`}>
                  {currentUser.isActive ? 'نشط' : 'غير نشط'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="action-btn cancel-btn"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="action-btn save-btn"
                  >
                    حفظ التغييرات
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="action-btn edit-btn"
                >
                  تعديل الملف الشخصي
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Account Security Section */}
        <div className="security-section">
          <div className="profile-section-header">
            <div className="profile-section-header-line"></div>
            <div>
              <h3 className="profile-section-title">أمان الحساب</h3>
              <p className="profile-section-subtitle">تغيير كلمة المرور وغيرها من الإعدادات</p>
            </div>
          </div>

          <p className="text-gray-600 mb-4">ل تغيير كلمة المرور أو إعدادات الأمان الأخرى، يرجى الاتصال بالمسؤول.</p>
          <button
            className="action-btn"
            style={{backgroundColor: '#e2e8f0', color: '#475569'}}
            disabled
          >
            تغيير كلمة المرور
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;