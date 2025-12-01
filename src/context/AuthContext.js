import React, { createContext, useState, useContext } from 'react';
import { taskApi } from '../api/taskApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const login = async (identifier, password) => {
    // Dans une application réelle, vous feriez un appel API ici
    // Pour l'instant, nous simulons la connexion avec des données fixes
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

  const getAllTasks = async () => {
    try {
      // Si les tâches sont déjà chargées, les retourner directement
      if (tasks.length > 0) {
        return tasks;
      }
      // Sinon, les récupérer de l'API
      const tasksFromApi = await taskApi.getAllTasks();
      setTasks(tasksFromApi);
      return tasksFromApi;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      return [];
    }
  };

  const getTasksByUser = async (userId) => {
    try {
      // Récupérer toutes les tâches depuis l'API
      const allTasks = await taskApi.getAllTasks();
      // Filtrer côté client pour les tâches assignées ou créées par l'utilisateur
      return allTasks.filter(task =>
        (task.created_by && task.created_by == userId) ||
        (task.assignee && task.assignee == userId)
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches utilisateur:', error);
      return [];
    }
  };

  const getTasksForValidation = async () => {
    try {
      // Récupérer toutes les tâches depuis l'API
      const allTasks = await taskApi.getAllTasks();
      // Filtrer les tâches en attente de validation
      return allTasks.filter(task =>
        task.status === 'pending' ||
        task.status === 'في انتظار الموافقة' ||
        task.status === 'draft' ||
        task.status === 'مسودة'
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches en attente de validation:', error);
      return [];
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskApi.createTask({
        ...taskData,
        created_by: currentUser.id
      });
      
      // Mettre à jour la liste locale des tâches
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      // S'assurer que les champs sont correctement nommés pour la base de données
      const formattedTaskData = {
        ...taskData,
        created_by: taskData.created_by || taskData.createdBy,
        assignee: taskData.assignee || taskData.assignedTo
      };

      const updatedTask = await taskApi.updateTask(taskId, formattedTaskData);
      
      // Mettre à jour la liste locale des tâches
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  };

  const updateTaskStatus = async (taskId, status, validatedBy = null, comment = null) => {
    try {
      // Récupérer la tâche actuelle pour avoir tous les détails
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        throw new Error('Tâche non trouvée');
      }
      
      // Créer les données mises à jour
      const updatedTaskData = { 
        ...currentTask, 
        status 
      };
      
      if (validatedBy) updatedTaskData.validated_by = validatedBy;
      if (comment) updatedTaskData.comment = comment;
      
      const updatedTask = await taskApi.updateTask(taskId, updatedTaskData);
      
      // Mettre à jour la liste locale des tâches
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      
      // Mettre à jour la liste locale des tâches
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    // Dans une application réelle, vous feriez un appel API ici
    // Pour l'instant, nous retournons une erreur car la fonctionnalité n'est pas complètement implémentée
    return { success: false, message: 'La fonctionnalité d\'inscription n\'est pas encore disponible dans la version connectée à la base de données' };
  };

  const getRegistrationRequests = async () => {
    // Pour l'instant, retourner un tableau vide
    return [];
  };

  const updateRegistrationRequestStatus = async (requestId, status, validatedBy = null) => {
    // Pour l'instant, cette fonction ne fait rien
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
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
    deleteTask,
    registerUser,
    getRegistrationRequests,
    updateRegistrationRequestStatus,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};