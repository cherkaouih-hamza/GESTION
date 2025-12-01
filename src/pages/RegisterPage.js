import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير مطابقة');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">تم إرسال طلبك</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              تم إرسال طلب التسجيل بنجاح. يرجى انتظار موافقة فريق الإعلام.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full"
              dir="rtl"
            >
              العودة للتسجيل
              <ArrowRightIcon className="w-4 h-4 mr-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">إنشاء حساب جديد</h2>
          <p className="text-sm text-gray-600 mt-2">املأ المعلومات التالية للتسجيل</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4" dir="rtl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} dir="rtl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn-primary w-full mt-6 ${loading ? 'opacity-75' : ''}`}
            disabled={loading}
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              لديك حساب؟ تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;