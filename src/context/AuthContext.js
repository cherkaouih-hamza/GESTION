import React, { createContext, useState, useContext } from 'react';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/userApi';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const login = async (identifier, password) => {
    try {
      // Utiliser l'API de login directement au lieu de récupérer tous les utilisateurs
      const response = await authApi.login(identifier, password);

      if (response.success) {
        setCurrentUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      if (error.message.includes('Impossible de se connecter au serveur')) {
        return {
          success: false,
          message: 'غير قادر على الاتصال بالخادم. يرجى التأكد من تشغيل الخادم الخلفي'
        };
      }
      return { success: false, message: error.message || 'حدث خطأ أثناء تسجيل الدخول' };
    }
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
      console.log('createTask appelé avec:', { taskData, currentUser, currentUserId: currentUser?.id });

      if (!currentUser || !currentUser.id) {
        throw new Error('Utilisateur non authentifié ou ID utilisateur manquant');
      }

      // Convertir les champs pour correspondre au format attendu par le backend
      const formattedTaskData = {
        ...taskData,
        created_by: currentUser.id,  // L'utilisateur connecté est le créateur
        createdBy: currentUser.id    // Ajout selon les conventions possibles
      };

      // Si assignee est fourni comme une chaîne vide ou null, le définir explicitement à null
      if (formattedTaskData.assignee === '' || formattedTaskData.assignee === undefined) {
        formattedTaskData.assignee = null;
      }

      const newTask = await taskApi.createTask(formattedTaskData);

      console.log('Tâche créée avec succès:', newTask);
      // Mettre à jour la liste locale des tâches
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
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
    try {
      console.log('Tentative d\'inscription avec les données:', userData);

      // Utiliser l'API d'inscription directement
      const response = await authApi.register({
        username: userData.name || userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role || 'utilisateur'
      });

      console.log('Réponse de l\'API d\'inscription:', response);

      if (response.success) {
        console.log('Utilisateur créé avec succès:', response.user);

        return { success: true, message: 'تم إنشاء الحساب بنجاح', user: response.user };
      } else {
        console.log('Erreur de l\'API d\'inscription:', response.error || response.message);
        return { success: false, message: response.error || response.message || 'خطأ أثناء التسجيل' };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return {
        success: false,
        message: 'حدث خطأ أثناء التسجيل: ' +
          (error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Erreur inconnue')
      };
    }
  };

  const getRegistrationRequests = async () => {
    try {
      // Récupérer tous les utilisateurs avec is_active = false (en attente de validation)
      const allUsers = await userApi.getAllUsers();
      const pendingUsers = allUsers.filter(user => user.is_active === false || user.is_active === 'false' || user.is_active === 'f');

      // Formater les données pour qu'elles correspondent au format attendu
      return pendingUsers.map(user => ({
        id: user.id,
        name: user.username || user.name,
        email: user.email,
        phone: user.phone || user.telephone || 'N/A',  // Supposant que le numéro de téléphone est stocké dans un champ phone ou telephone
        status: 'pending',
        createdAt: user.created_at || user.createdAt
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes d\'inscription:', error);
      return [];
    }
  };

  const updateRegistrationRequestStatus = async (requestId, status, validatedBy = null, comment = null) => {
    try {
      console.log(`Tentative de mise à jour du statut de l'inscription ID: ${requestId}, nouveau statut: ${status}`);

      // Pour accepter ou refuser une demande d'inscription, on met à jour le champ is_active
      if (status === 'approved') {
        // Mettre à jour le statut du compte à actif
        console.log(`Approving user ID: ${requestId}`);
        const userData = {
          is_active: true,
          updated_at: new Date().toISOString()
        };
        console.log('Données envoyées pour la mise à jour:', userData);
        const updatedUser = await userApi.updateUser(requestId, userData);
        console.log(`Inscription approuvée avec succès, utilisateur mis à jour:`, updatedUser);
        return updatedUser;
      } else if (status === 'rejected') {
        // Supprimer l'utilisateur car son inscription a été refusée
        console.log(`Rejecting user ID: ${requestId}`);
        const deletedUser = await userApi.deleteUser(requestId);
        console.log(`Inscription rejetée avec succès, utilisateur supprimé:`, deletedUser);
        return deletedUser;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la demande d\'inscription:', error);
      console.error('Détails:', error.message, error.response?.data);
      console.error('Statut:', status, 'ID:', requestId);
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const users = await userApi.getAllUsers();
      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  const createUser = async (userData) => {
    try {
      const user = await userApi.createUser(userData);
      return user;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const user = await userApi.updateUser(userId, userData);
      return user;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const user = await userApi.deleteUser(userId);
      return user;
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