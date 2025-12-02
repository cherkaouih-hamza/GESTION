import React, { createContext, useState, useContext } from 'react';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/userApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const login = async (identifier, password) => {
    try {
      // Récupérer tous les utilisateurs de la base de données
      const allUsers = await userApi.getAllUsers();

      // Trouver l'utilisateur par email ou téléphone
      let user = null;

      // Chercher par email
      const userByEmail = allUsers.find(u => u.email === identifier);
      if (userByEmail) {
        user = userByEmail;
      } else {
        // Chercher par téléphone
        const userByPhone = allUsers.find(u => u.phone === identifier || u.phone === identifier.replace(/[^0-9]/g, ''));
        if (userByPhone) {
          user = userByPhone;
        }
      }

      if (!user) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // Vérifier le mot de passe (dans une application réelle, le mot de passe devrait être hashé)
      // Pour l'instant, nous faisons une vérification simple
      if (user.password !== password) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      if (user.isActive === false || user.isActive === 'false') {
        return { success: false, message: 'الحساب غير نشط' };
      }

      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
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
    try {
      console.log('Tentative d\'inscription avec les données:', userData);

      // Vérifier si l'utilisateur existe déjà
      const existingUsers = await userApi.getAllUsers();
      console.log('Utilisateurs existants:', existingUsers);

      const emailExists = existingUsers.some(u => u.email === userData.email);
      const phoneExists = existingUsers.some(u => u.phone === userData.phone);

      if (emailExists) {
        return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
      }

      if (phoneExists) {
        return { success: false, message: 'رقم الهاتف مسجل مسبقاً' };
      }

      // Hash du mot de passe (dans une application réelle, cela devrait être fait côté serveur)
      // Pour l'instant, nous enregistrons le mot de passe tel quel (à améliorer pour la sécurité)
      const newUser = {
        name: userData.name, // Envoyer name au lieu de username à l'API
        email: userData.email,
        password: userData.password, // Ce devrait être un mot de passe hashé dans une application réelle
        phone: userData.phone, // Ajouter le téléphone
        role: 'utilisateur', // Par défaut, un nouvel utilisateur est un utilisateur standard
      };

      console.log('Données envoyées à l\'API:', newUser);

      // Créer l'utilisateur dans la base de données
      const createdUser = await userApi.createUser(newUser);
      console.log('Utilisateur créé avec succès:', createdUser);

      // Envoyer un email de confirmation (simulé pour l'instant)
      try {
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userData.email, name: userData.name })
        });
        console.log('Réponse email confirmation:', emailResponse.status);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
        // Ne pas échouer l'inscription même si l'email échoue
      }

      return { success: true, message: 'تم إنشاء الحساب بنجاح', user: createdUser };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      console.error('Détails de l\'erreur:', error.message, error.response?.data || error.response);
      return { success: false, message: 'حدث خطأ أثناء التسجيل: ' + (error.message || 'Erreur inconnue') };
    }
  };

  const getRegistrationRequests = async () => {
    try {
      // Récupérer tous les utilisateurs avec is_active = false (en attente de validation)
      const allUsers = await userApi.getAllUsers();
      const pendingUsers = allUsers.filter(user => user.is_active === false || user.is_active === 'false');

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
      // Pour accepter ou refuser une demande d'inscription, on met à jour le champ is_active
      if (status === 'approved') {
        // Mettre à jour le statut du compte à actif
        const updatedUser = await userApi.updateUser(requestId, {
          is_active: true,
          updated_at: new Date().toISOString()
        });
        return updatedUser;
      } else if (status === 'rejected') {
        // Supprimer l'utilisateur car son inscription a été refusée
        const deletedUser = await userApi.deleteUser(requestId);
        return deletedUser;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la demande d\'inscription:', error);
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