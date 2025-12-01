import React, { createContext, useState, useContext } from 'react';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    phone: '0612345678',
    password: 'admin123',
    name: 'مدير النظام',
    role: 'admin',
    isActive: true
  },
  {
    id: 2,
    email: 'responsable@example.com',
    phone: '0623456789',
    password: 'responsable123',
    name: 'المسؤول',
    role: 'responsable',
    isActive: true
  },
  {
    id: 3,
    email: 'utilisateur@example.com',
    phone: '0634567890',
    password: 'utilisateur123',
    name: 'المستخدم',
    role: 'utilisateur',
    isActive: true
  }
];

// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    name: 'مهمة تجريبية 1',
    description: 'هذا وصف مهمتنا التجريبية الأولى',
    type: 'فيديو',
    startDate: '2023-12-01',
    endDate: '2023-12-10',
    mediaLink: 'https://example.com/video1',
    isActive: true,
    status: 'جارية',
    createdBy: 3,
    validatedBy: 2,
    assignedTo: 3
  },
  {
    id: 2,
    name: 'مهمة تجريبية 2',
    description: 'هذا وصف مهمتنا التجريبية الثانية',
    type: 'بطاقة',
    startDate: '2023-12-05',
    endDate: '2023-12-15',
    mediaLink: 'https://example.com/image1',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 3,
    validatedBy: null,
    assignedTo: 3
  },
  {
    id: 3,
    name: 'مهمة تجريبية 3',
    description: 'هذا وصف مهمتنا التجريبية الثالثة',
    type: 'إعلان',
    startDate: '2023-11-25',
    endDate: '2023-12-05',
    mediaLink: 'https://example.com/ad1',
    isActive: true,
    status: 'مكتملة',
    createdBy: 2,
    validatedBy: 1,
    assignedTo: 2
  }
];

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);

  const login = async (identifier, password) => {
    // Find user by email or phone
    const user = mockUsers.find(
      u => (u.email === identifier || u.phone === identifier) && u.password === password
    );

    if (!user) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    if (!user.isActive) {
      return { success: false, message: 'الحساب غير نشط' };
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

  const getUserRole = () => {
    return currentUser ? currentUser.role : null;
  };

  const getAllTasks = () => {
    return tasks;
  };

  const getTasksByUser = (userId) => {
    return tasks.filter(task => task.createdBy === userId || task.assignedTo === userId);
  };

  const getTasksForValidation = () => {
    return tasks.filter(task => task.status === 'في انتظار الموافقة');
  };

  const createTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      status: 'في انتظار الموافقة',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTaskStatus = (taskId, status, validatedBy = null, comment = null) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status, 
            validatedBy: validatedBy || task.validatedBy,
            comment: comment || task.comment
          } 
        : task
    ));
  };

  const updateTask = (taskId, taskData) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    getAllTasks,
    getTasksByUser,
    getTasksForValidation,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};