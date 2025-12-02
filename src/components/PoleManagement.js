// src/components/PoleManagement.js
import React, { useState, useEffect } from 'react';
import { poleApi } from '../api/poleApi';

const PoleManagement = () => {
  const [poles, setPoles] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingPole, setEditingPole] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPoles();
  }, []);

  const fetchPoles = async () => {
    try {
      setLoading(true);
      const data = await poleApi.getPoles();
      setPoles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des pôles:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du pôle est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingPole) {
        await poleApi.updatePole(editingPole.id, formData);
        setMessage('Pôle mis à jour avec succès');
      } else {
        await poleApi.createPole(formData);
        setMessage('Pôle créé avec succès');
      }
      
      setFormData({ name: '', description: '' });
      setEditingPole(null);
      fetchPoles();
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde du pôle');
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (pole) => {
    setFormData({ name: pole.name, description: pole.description || '' });
    setEditingPole(pole);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pôle ?')) {
      try {
        await poleApi.deletePole(id);
        setMessage('Pôle supprimé avec succès');
        fetchPoles();
      } catch (error) {
        setMessage('Erreur lors de la suppression du pôle');
        console.error('Erreur:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', description: '' });
    setEditingPole(null);
    setErrors({});
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des pôles...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Pôles</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {message}
          <button 
            onClick={() => setMessage('')}
            className="float-right text-green-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          {editingPole ? 'Modifier le Pôle' : 'Ajouter un Nouveau Pôle'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du Pôle *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Entrez le nom du pôle"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Description du pôle (optionnel)"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {editingPole ? 'Mettre à jour' : 'Ajouter'}
            </button>
            
            {editingPole && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste des pôles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Liste des Pôles</h3>
        
        {poles.length === 0 ? (
          <p className="text-gray-500">Aucun pôle trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {poles.map((pole) => (
                  <tr key={pole.id} className={pole.is_active ? '' : 'bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pole.name} {pole.is_active ? '' : '(Inactif)'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pole.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(pole)}
                        className="text-indigo-600 hover:text-indigo-900 ml-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(pole.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoleManagement;