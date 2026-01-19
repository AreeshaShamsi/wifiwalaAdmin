import React, { useState, useEffect } from "react";
import { Menu, X, Plus, Edit2, Trash2, Save, XCircle } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";




const BASE_URL = "https://wifiwala-backend.vercel.app";

export const API_CREATE_URL = `${BASE_URL}/api/plans/create`;
export const API_READ_URL   = `${BASE_URL}/api/plans`;
export const API_UPDATE_URL = `${BASE_URL}/api/plans/update`; 
export const API_DELETE_URL = `${BASE_URL}/api/plans`;       

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    provider: "",
    speed: "",
    price: "",
    validity: "30 days",
    data: "Unlimited",
    color: "from-blue-500 to-blue-600",
    icon: "fa-solid fa-wifi"
  });

  const colorOptions = [
    { value: "from-blue-500 to-blue-600", label: "Blue" },
    { value: "from-purple-500 to-purple-600", label: "Purple" },
    { value: "from-red-500 to-red-600", label: "Red" },
    { value: "from-green-500 to-green-600", label: "Green" },
    { value: "from-orange-500 to-orange-600", label: "Orange" },
    { value: "from-pink-500 to-pink-600", label: "Pink" },
  ];

  const iconOptions = [
    { value: "fa-solid fa-wifi", label: "WiFi" },
    { value: "fa-solid fa-tower-broadcast", label: "Tower" },
    { value: "fa-solid fa-signal", label: "Signal" },
    { value: "fa-solid fa-network-wired", label: "Network" },
  ];

  // Fetch plans when component mounts
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_READ_URL);
      const data = await response.json();
      
      if (data.success) {
        // Map backend data and add UI properties
        const formattedPlans = data.plans.map(plan => ({
          id: plan._id,
          provider: plan.providerName,
          speed: plan.speed,
          price: plan.price,
          validity: plan.validity,
          data: plan.data,
          color: plan.color || "from-blue-500 to-blue-600",
          icon: plan.icon || "fa-solid fa-wifi"
        }));
        setPlans(formattedPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async () => {
    // Validation
    if (!formData.provider || !formData.speed || !formData.price || !formData.validity || !formData.data) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(API_CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerName: formData.provider,
          speed: formData.speed,
          price: formData.price,
          validity: formData.validity,
          data: formData.data,
          color: formData.color,
          icon: formData.icon
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Plan created successfully!");
        resetForm();
        // Fetch all plans again to show the newly created plan
        fetchPlans();
      } else {
        alert(data.message || "Failed to create plan");
      }
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("Failed to create plan. Please try again.");
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan.id);
    setFormData({
      provider: plan.provider,
      speed: plan.speed,
      price: plan.price,
      validity: plan.validity,
      data: plan.data,
      color: plan.color,
      icon: plan.icon
    });
    setShowAddModal(true);
  };

  const handleUpdatePlan = async () => {
    // Validation
    if (!formData.provider || !formData.speed || !formData.price || !formData.validity || !formData.data) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`${API_UPDATE_URL}/${editingPlan}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerName: formData.provider,
          speed: formData.speed,
          price: formData.price,
          validity: formData.validity,
          data: formData.data,
          color: formData.color,
          icon: formData.icon
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Plan updated successfully!");
        resetForm();
        // Fetch all plans again to show updated data
        fetchPlans();
      } else {
        alert(data.message || "Failed to update plan");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Failed to update plan. Please try again.");
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      const response = await fetch(`${API_DELETE_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Plan deleted successfully!");
        // Fetch all plans again to refresh the list
        fetchPlans();
      } else {
        alert(data.message || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      provider: "",
      speed: "",
      price: "",
      validity: "30 days",
      data: "Unlimited",
      color: "from-blue-500 to-blue-600",
      icon: "fa-solid fa-wifi"
    });
    setShowAddModal(false);
    setEditingPlan(null);
  };

  return (
    <>
    
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <Sidebar />

        <div className="lg:ml-64 min-h-screen lg:p-4">
          <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 lg:mb-6 pt-16 sm:pt-4 lg:pt-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Plans Management</h1>
                <p className="text-sm text-gray-600">Manage all broadband plans</p>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Add New Plan
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">Loading plans...</p>
              </div>
            ) : (
              <>
                {/* Plans Grid */}
                {plans.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                            <i className={`${plan.icon} text-xl`}></i>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditPlan(plan)}
                              className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all"
                            >
                              <Edit2 size={14} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.provider}</h3>
                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <i className="fa-solid fa-gauge text-indigo-600 text-xs"></i>
                            <span className="text-xs">Speed: <strong>{plan.speed}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <i className="fa-solid fa-calendar text-indigo-600 text-xs"></i>
                            <span className="text-xs">Validity: <strong>{plan.validity}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <i className="fa-solid fa-database text-indigo-600 text-xs"></i>
                            <span className="text-xs">Data: <strong>{plan.data}</strong></span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs text-gray-500">Price</span>
                              <div className="text-xl font-bold text-indigo-600">₹{plan.price}</div>
                            </div>
                            <button className={`px-3 py-1.5 bg-gradient-to-r ${plan.color} text-white rounded-lg font-semibold hover:opacity-90 transition-all text-xs`}>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {plans.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-clipboard-list text-3xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">No Plans Available</h3>
                    <p className="text-sm text-gray-500 mb-5">Start by adding your first broadband plan</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      <Plus size={18} />
                      Add First Plan
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingPlan ? "Edit Plan" : "Add New Plan"}
                </h2>
                <button
                  onClick={resetForm}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
                >
                  <XCircle size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Provider Name</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., BSNL Fiber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Speed</label>
                  <input
                    type="text"
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 100Mbps"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 449"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Validity</label>
                  <input
                    type="text"
                    value={formData.validity}
                    onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 30 days"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Data</label>
                  <input
                    type="text"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Color Theme</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 text-sm bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPlan ? handleUpdatePlan : handleAddPlan}
                  className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingPlan ? "Update Plan" : "Add Plan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </>
  );
}

export default PlansPage;