import React from 'react';
import '../styles/AccountPendingPage.css';

const AccountPendingPage = () => {
  return (
    <div className="account-pending-container">
      <div className="account-pending-content">
        <div className="account-pending-icon">
          ⏳
        </div>
        <h1 className="account-pending-title">حسابك قيد الانتظار</h1>
        <p className="account-pending-message">
          حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى تتم الموافقة على حسابك.
        </p>
        <p className="account-pending-subtitle">
          سيتم إعلامك عند قبول طلبك
        </p>
        <button 
          className="account-pending-logout-btn"
          onClick={() => {
            // Log out the user
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default AccountPendingPage;