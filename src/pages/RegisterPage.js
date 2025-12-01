import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RegisterPage.css';
import { ArrowRightIcon, UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

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
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="success-icon">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 text-center mt-4">تم إرسال طلبك!</h2>
            <p className="text-gray-600 text-center mt-2">
              تم إرسال طلب التسجيل بنجاح. يرجى انتظار موافقة فريق الإعلام.
            </p>
          </div>

          <div className="register-actions mt-6">
            <Link
              to="/login"
              className="btn-primary w-full flex items-center justify-center"
            >
              العودة للتسجيل
              <ArrowRightIcon className="w-4 h-4 mr-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-section">
            <div className="logo-icon">
              <UserIcon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mt-4">انضم إلينا الآن</h2>
          <p className="text-gray-600 text-center mt-2">أنشئ حسابك لتبدأ رحلتك معنا</p>
        </div>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label className="input-label">
              <UserIcon className="w-4 h-4 mr-2" />
              الاسم الكامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="example@domain.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <PhoneIcon className="w-4 h-4 mr-2" />
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+212 6xx xxx xxx"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <LockClosedIcon className="w-4 h-4 mr-2" />
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <LockClosedIcon className="w-4 h-4 mr-2" />
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn-primary w-full mt-6 ${loading ? 'opacity-75' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التسجيل...
              </span>
            ) : (
              'إنشاء حساب'
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              لديك حساب؟{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;