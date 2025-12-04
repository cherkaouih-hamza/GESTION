import React, { useState, useEffect } from 'react';
import { poleApi } from '../api/poleApi';
import { userApi } from '../api/userApi';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'فيديو',
    pole: '',
    priority: 'Normal',
    assignedTo: '',
    startDate: '',
    endDate: '',
    mediaLink: '',
    isActive: true
  });

  // État pour suivre si le composant est complètement initialisé
  const [isInitialized, setIsInitialized] = useState(false);
  const [poles, setPoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPoles, setLoadingPoles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadPoles = async () => {
      try {
        const polesData = await poleApi.getPoles();
        // Vérifier que les données sont un tableau
        if (Array.isArray(polesData)) {
          setPoles(polesData);
        } else {
          console.warn('Les données des pôles ne sont pas un tableau:', polesData);
          // Fallback: utiliser une liste par défaut
          setPoles([
            { id: 1, name: 'Production Générale', description: 'Toutes les activités de production générale' },
            { id: 2, name: 'Koutoub', description: 'Activités liées aux publications et ouvrages' },
            { id: 3, name: 'Traduction', description: 'Activités de traduction' },
            { id: 4, name: 'Nadwate', description: 'Conférences et séminaires' },
            { id: 5, name: 'Ziyarate', description: 'Activités de visites et pèlerinages' },
            { id: 6, name: 'Projet (Wikalaat Assfar et Koutab Al-Tazkiya)', description: 'Projets spéciaux et voyages' },
            { id: 7, name: 'Podcast', description: 'Émissions et contenus audio' },
            { id: 8, name: 'Academia', description: 'Éducation et formations académiques' },
            { id: 9, name: 'Autre', description: 'Autres activités non classées' }
          ]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des pôles:', error);
        // Fallback: utiliser une liste par défaut
        setPoles([
          { id: 1, name: 'Production Générale', description: 'Toutes les activités de production générale' },
          { id: 2, name: 'Koutoub', description: 'Activités liées aux publications et ouvrages' },
          { id: 3, name: 'Traduction', description: 'Activités de traduction' },
          { id: 4, name: 'Nadwate', description: 'Conférences et séminaires' },
          { id: 5, name: 'Ziyarate', description: 'Activités de visites et pèlerinages' },
          { id: 6, name: 'Projet (Wikalaat Assfar et Koutab Al-Tazkiya)', description: 'Projets spéciaux et voyages' },
          { id: 7, name: 'Podcast', description: 'Émissions et contenus audio' },
          { id: 8, name: 'Academia', description: 'Éducation et formations académiques' },
          { id: 9, name: 'Autre', description: 'Autres activités non classées' }
        ]);
      } finally {
        setLoadingPoles(false);
      }
    };

    const loadUsers = async () => {
      try {
        const usersData = await userApi.getAllUsers();
        // Vérifier que les données sont un tableau
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          console.warn('Les données des utilisateurs ne sont pas un tableau:', usersData);
          // Fallback: utiliser une liste par défaut
          setUsers([
            { id: 1, username: 'Admin User', email: 'admin@example.com', role: 'admin' },
            { id: 2, username: 'Test User', email: 'user@example.com', role: 'utilisateur' }
          ]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // Fallback: utiliser une liste par défaut
        setUsers([
          { id: 1, username: 'Admin User', email: 'admin@example.com', role: 'admin' },
          { id: 2, username: 'Test User', email: 'user@example.com', role: 'utilisateur' }
        ]);
      } finally {
        setLoadingUsers(false);
      }
    };

    const loadData = async () => {
      await Promise.all([loadPoles(), loadUsers()]);
      setIsInitialized(true);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (task && typeof task === 'object' && !Array.isArray(task)) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        type: task.type || 'فيديو',
        pole: task.pole || '', // Adding the pole field for existing tasks
        priority: task.priority || 'Normal', // Adding the priority field for existing tasks
        assignedTo: task.assignee ? task.assignee.toString() : '', // Convertir assignee en chaîne pour le select
        startDate: task.start_date || task.startDate || '',
        endDate: task.end_date || task.endDate || '',
        mediaLink: task.media_link || task.mediaLink || '',
        isActive: task.is_active !== undefined ? task.is_active : task.isActive !== undefined ? task.isActive : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'فيديو',
        pole: '', // Adding the pole field for new tasks
        priority: 'Normal', // Adding the priority field for new tasks
        assignedTo: '', // Adding the assignment field for new tasks
        startDate: '',
        endDate: '',
        mediaLink: '',
        isActive: true
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'assignedTo' && value !== '' ? parseInt(value) : value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المهمة مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'الوصف مطلوب';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        newErrors.startDate = 'تاريخ البداية غير صحيح';
        newErrors.endDate = 'تاريخ النهاية غير صحيح';
      } else if (startDate > endDate) {
        newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
      }
    }

    if (!formData.pole) {
      newErrors.pole = 'القطب مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convertir les champs pour correspondre au format attendu par le backend
      // Ne pas inclure created_by ici, car il est ajouté automatiquement dans le contexte Auth
      const taskData = {
        title: formData.name,  // Convertir name à title
        description: formData.description,
        status: formData.status || 'pending',  // Valeur par défaut
        priority: formData.priority,
        pole: formData.pole,
        assignee: formData.assignedTo ? parseInt(formData.assignedTo) : null,  // Renommer assignedTo à assignee et convertir en entier
        due_date: formData.endDate ? (new Date(formData.endDate).toISOString()) : null,  // Convertir en format ISO complet
        start_date: formData.startDate ? (new Date(formData.startDate).toISOString()) : null,  // Convertir en format ISO complet
        media_link: formData.mediaLink || null,  // Inclure media_link
        type: formData.type || null,  // Inclure type
        is_active: formData.isActive !== undefined ? formData.isActive : true  // Inclure is_active
      };

      console.log('Données envoyées pour la création de tâche:', taskData);

      if (task) {
        onSubmit(task.id, taskData);
      } else {
        onSubmit(taskData);
      }
    }
  };

  // Ne pas afficher le formulaire tant que les données nécessaires ne sont pas chargées
  if (loadingPoles || loadingUsers || !isInitialized) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="text-gray-600">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // Vérifier que les données sont correctement formatées avant le rendu
  if (!Array.isArray(poles) || !Array.isArray(users)) {
    console.error("Poles or users data is not in expected format", { poles, users });
    return (
      <div className="error-state">
        <p className="text-red-600">خطأ في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rtl text-right">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المهمة *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="أدخل اسم المهمة"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">وصف مختصر *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="أدخل وصف المهمة"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع المهمة</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="فيديو">فيديو</option>
            <option value="بطاقة">بطاقة</option>
            <option value="إعلان">إعلان</option>
            <option value="صوتي">صوتي</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">القطب (Pôle)</label>
          <select
            name="pole"
            value={formData.pole}
            onChange={handleChange}
            className={`w-full border ${errors.pole ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">اختر القطب</option>
            {loadingPoles ? (
              <option value="" disabled>جاري التحميل...</option>
            ) : (
              poles.map((pole) => (
                <option key={pole.id} value={pole.name}>
                  {pole.name}
                </option>
              ))
            )}
          </select>
          {errors.pole && <p className="mt-1 text-sm text-red-600">{errors.pole}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Faible">ضعيفة</option>
            <option value="Normal">عادي</option>
            <option value="Important">مهم</option>
            <option value="Urgent">عاجل</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">المستخدم المكلف</label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">اختر المستخدم</option>
          {loadingUsers ? (
            <option value="" disabled>جاري التحميل...</option>
          ) : (
            (users || []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.username || user.email}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">حالة التفعيل</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="mr-2 text-sm text-gray-700">
            {formData.isActive ? 'مفعلة' : 'غير مفعلة'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">رابط الوسائط</label>
        <input
          type="url"
          name="mediaLink"
          value={formData.mediaLink}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://example.com/video.mp4"
        />
        <p className="mt-1 text-sm text-gray-500">رابط الفيديو أو الصورة أو الملف</p>
      </div>

      <div className="flex justify-end space-x-3 space-x-reverse">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {task ? 'تحديث المهمة' : 'إنشاء المهمة'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;