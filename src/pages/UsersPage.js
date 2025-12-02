import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/UsersPage.css';

const UsersPage = () => {
  const { currentUser, getAllUsers, createUser, updateUser, deleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'utilisateur',
    pole: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = () => {
    setModalType('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'utilisateur',
      pole: ''
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalType('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name || user.username,
      email: user.email,
      phone: user.phone || '',
      password: '', // Don't show password in edit form
      role: user.role,
      pole: user.pole || ''
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'add') {
        await createUser(formData);
      } else if (modalType === 'edit') {
        await updateUser(selectedUser.id, formData);
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    (user.name || user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.pole || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-right">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 users-page">
        <div className="users-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">إدارة المستخدمين</h1>
          <p className="text-right opacity-90">قائمة بجميع المستخدمين في النظام</p>
        </div>

        {/* Controls */}
        <div className="users-controls">
          <input
            type="text"
            placeholder="بحث في المستخدمين..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddUser}
            className="add-user-btn"
          >
            + إضافة مستخدم
          </button>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="text-right">
                    الاسم
                  </th>
                  <th scope="col" className="text-right">
                    البريد الإلكتروني
                  </th>
                  <th scope="col" className="text-right">
                    القطب
                  </th>
                  <th scope="col" className="text-right">
                    الدور
                  </th>
                  <th scope="col" className="text-right">
                    الحالة
                  </th>
                  <th scope="col" className="text-right">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="text-right">
                        <div className="font-medium text-gray-900">{user.name || user.username}</div>
                      </td>
                      <td className="text-sm text-gray-500 text-right">
                        {user.email}
                      </td>
                      <td className="text-sm text-gray-500 text-right">
                        {user.pole || '-'}
                      </td>
                      <td className="text-right">
                        <span className={`role-badge ${
                          user.role === 'admin'
                            ? 'role-admin'
                            : user.role === 'responsable'
                              ? 'role-responsable'
                              : 'role-utilisateur'
                        }`}>
                          {user.role === 'admin' ? 'مدير النظام' :
                           user.role === 'responsable' ? 'المسؤول' : 'المستخدم'}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className={`status-badge ${
                          user.is_active ? 'status-active' : 'status-inactive'
                        }`}>
                          {user.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="action-btn edit-btn"
                            disabled={user.id === currentUser.id} // Don't allow editing own account
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="action-btn delete-btn"
                            disabled={user.id === currentUser.id} // Don't allow deleting own account
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <h3 className="text-lg font-medium">لا توجد مستخدمون</h3>
                      <p className="mt-1">لا توجد مستخدمون مطابقون للبحث</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Adding/Editing Users */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="text-xl font-bold text-right">
                  {modalType === 'add' ? 'إضافة مستخدم جديد' : 'تعديل المستخدم'}
                </h3>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">الاسم الكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">القطب</label>
                    <input
                      type="text"
                      name="pole"
                      value={formData.pole}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  {modalType === 'add' && (
                    <div className="form-group">
                      <label className="form-label">كلمة المرور</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">الدور</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="utilisateur">المستخدم</option>
                      <option value="responsable">المسؤول</option>
                      <option value="admin">مدير النظام</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="action-btn"
                      style={{backgroundColor: '#e2e8f0', color: '#475569'}}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="action-btn"
                      style={{backgroundColor: '#6366f1', color: 'white'}}
                    >
                      {modalType === 'add' ? 'إضافة' : 'تحديث'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;