import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect based on role
        switch(result.user.role) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'responsable':
            navigate('/dashboard');
            break;
          case 'utilisateur':
            navigate('/dashboard');
            break;
          default:
            navigate('/login');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <div className="login-container">
      <div className="decorative-element decorative-circle"></div>
      <div className="decorative-element decorative-triangle"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <img src="/LOGOIACSASVERT.png" alt="LOGOIACSAS" className="logo-image" />
          </div>
          <h2>منصة إدارة المشاريع و المتابعة الإعلامية</h2>
          <p>تسجيل الدخول إلى حسابك</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <i>📧</i> البريد الإلكتروني أو الهاتف
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i>🔒</i> كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button type="button" className="forgot-password" onClick={(e) => {
              e.preventDefault();
              alert('يرجى الاتصال بفريق الدعم للحصول على مساعدة في استعادة كلمة المرور');
            }}>
              هل نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            className="btn-login"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="login-footer">
          <p>للاختبار: يمكنك استخدام البريد admin@example.com وكلمة المرور 123456</p>
          <p className="mt-4">
            لا تملك حساب؟{' '}
            <Link to="/register" className="register-link">
              اشترك الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;