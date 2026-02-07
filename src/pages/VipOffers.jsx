import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar.jsx";

// Set your backend URL here
const BASE_URL = 'http://localhost:5000';

// API Endpoints
export const API_CREATE_URL = `${BASE_URL}/api/vip-plans/create`;
export const API_READ_URL   = `${BASE_URL}/api/vip-plans`;
export const API_UPDATE_URL = `${BASE_URL}/api/vip-plans/update`; 
export const API_DELETE_URL = `${BASE_URL}/api/vip-plans/delete`;

const VIPPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'update', 'delete', 'view'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    plan_name: '',
    description: '',
    speed_mbps: '',
    data_policy: '',
    validity_days: '',
    ott_platforms: '',
    additional_benefits: ''
  });

  // Fetch all VIP plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_READ_URL);
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      alert('Failed to load VIP plans');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, plan = null) => {
    setModalMode(mode);
    setSelectedPlan(plan);
    setImageFile(null);
    setImagePreview(null);

    if (mode === 'update' && plan) {
      setFormData({
        plan_name: plan.plan_name || '',
        description: plan.description || '',
        speed_mbps: plan.speed_mbps || '',
        data_policy: plan.data_policy || '',
        validity_days: plan.validity_days || '',
        ott_platforms: Array.isArray(plan.ott_platforms) 
          ? plan.ott_platforms.join(', ') 
          : plan.ott_platforms || '',
        additional_benefits: Array.isArray(plan.additional_benefits) 
          ? plan.additional_benefits.join(', ') 
          : plan.additional_benefits || ''
      });
      if (plan.image_url) {
        setImagePreview(`${BASE_URL}${plan.image_url}`);
      }
    } else if (mode === 'create') {
      setFormData({
        plan_name: '',
        description: '',
        speed_mbps: '',
        data_policy: '',
        validity_days: '',
        ott_platforms: '',
        additional_benefits: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('plan_name', formData.plan_name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('speed_mbps', formData.speed_mbps);
      formDataToSend.append('data_policy', formData.data_policy);
      formDataToSend.append('validity_days', formData.validity_days);
      
      // Convert comma-separated strings to JSON arrays
      if (formData.ott_platforms) {
        const ottArray = formData.ott_platforms.split(',').map(item => item.trim()).filter(Boolean);
        formDataToSend.append('ott_platforms', JSON.stringify(ottArray));
      }
      
      if (formData.additional_benefits) {
        const benefitsArray = formData.additional_benefits.split(',').map(item => item.trim()).filter(Boolean);
        formDataToSend.append('additional_benefits', JSON.stringify(benefitsArray));
      }

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (modalMode === 'create') {
        response = await fetch(API_CREATE_URL, {
          method: 'POST',
          body: formDataToSend
        });
      } else if (modalMode === 'update') {
        response = await fetch(`${API_UPDATE_URL}/${selectedPlan.id}`, {
          method: 'PUT',
          body: formDataToSend
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save plan');
      }

      await fetchPlans();
      closeModal();
      alert(modalMode === 'create' ? 'Plan created successfully!' : 'Plan updated successfully!');
    } catch (error) {
      console.error('Error saving plan:', error);
      alert(error.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DELETE_URL}/${selectedPlan.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete plan');
      }

      await fetchPlans();
      closeModal();
      alert('Plan deleted successfully!');
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert(error.message || 'Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };

  const formatArray = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || 'N/A';
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">VIP Plans</h1>
          
          <button
            onClick={() => openModal('create')}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Plan
          </button>
        </div>

        {/* Loading State */}
        {loading && plans.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data Policy</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Validity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Speed</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No VIP plans found. Create your first plan!
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan, index) => (
                      <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4">
                          {plan.image_url ? (
                            <img 
                              src={`${BASE_URL}${plan.image_url}`} 
                              alt={plan.plan_name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23e5e7eb"/></svg>';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{plan.plan_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{plan.data_policy}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{plan.validity_days} days</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{plan.speed_mbps || 'N/A'} Mbps</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              onClick={() => openModal('view', plan)}
                              className="px-4 py-1.5 bg-blue-500 text-white text-xs rounded font-medium hover:bg-blue-600 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openModal('update', plan)}
                              className="px-4 py-1.5 bg-green-500 text-white text-xs rounded font-medium hover:bg-green-600 transition-colors"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => openModal('delete', plan)}
                              className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Create New Plan' : 
                   modalMode === 'update' ? 'Update Plan' : 
                   modalMode === 'view' ? 'Plan Details' : 'Delete Plan'}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalMode === 'delete' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete VIP Plan?</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedPlan?.plan_name}</span>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={closeModal}
                      disabled={loading}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Delete Plan
                    </button>
                  </div>
                </div>
              ) : modalMode === 'view' ? (
                <div className="py-4">
                  <div className="space-y-6">
                    {selectedPlan?.image_url && (
                      <div className="flex justify-center">
                        <img 
                          src={`${BASE_URL}${selectedPlan.image_url}`} 
                          alt={selectedPlan.plan_name}
                          className="w-48 h-48 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Plan Name</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedPlan?.plan_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Data Policy</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedPlan?.data_policy}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Validity</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedPlan?.validity_days} days</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Speed</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedPlan?.speed_mbps || 'N/A'} Mbps</p>
                      </div>
                    </div>

                    {selectedPlan?.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{selectedPlan.description}</p>
                        </div>
                      </div>
                    )}

                    {selectedPlan?.ott_platforms && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">OTT Platforms</label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{formatArray(selectedPlan.ott_platforms)}</p>
                        </div>
                      </div>
                    )}

                    {selectedPlan?.additional_benefits && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Additional Benefits</label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{formatArray(selectedPlan.additional_benefits)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Image</label>
                      <div className="flex items-center gap-4">
                        {imagePreview && (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name *</label>
                      <input
                        type="text"
                        value={formData.plan_name}
                        onChange={(e) => setFormData({...formData, plan_name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="e.g., Platinum VIP"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all h-20 resize-none"
                        placeholder="Brief description of the plan"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Speed (Mbps)</label>
                        <input
                          type="number"
                          value={formData.speed_mbps}
                          onChange={(e) => setFormData({...formData, speed_mbps: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="e.g., 100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Validity (Days) *</label>
                        <input
                          type="number"
                          value={formData.validity_days}
                          onChange={(e) => setFormData({...formData, validity_days: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="e.g., 30"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Data Policy *</label>
                      <input
                        type="text"
                        value={formData.data_policy}
                        onChange={(e) => setFormData({...formData, data_policy: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="e.g., Unlimited, 100GB, etc."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">OTT Platforms (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.ott_platforms}
                        onChange={(e) => setFormData({...formData, ott_platforms: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="e.g., Netflix, Amazon Prime, Disney+"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Benefits (comma-separated)</label>
                      <textarea
                        value={formData.additional_benefits}
                        onChange={(e) => setFormData({...formData, additional_benefits: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all h-24 resize-none"
                        placeholder="e.g., 24/7 Support, Priority Service, Free Installation"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={loading}
                      className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      {modalMode === 'create' ? 'Create Plan' : 'Update Plan'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VIPPlans;