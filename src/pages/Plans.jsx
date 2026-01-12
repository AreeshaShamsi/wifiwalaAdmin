import React, { useState } from "react";
import { Menu, X, Plus, Edit2, Trash2, Save, XCircle } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";


  
function PlansPage() {
  const [plans, setPlans] = useState([
    { 
      id: 1,
      provider: "BSNL Fiber", 
      speed: "100Mbps", 
      price: "449", 
      validity: "30 days",
      data: "Unlimited",
      color: "from-blue-500 to-blue-600",
      icon: "fa-solid fa-wifi"
    },
    { 
      id: 2,
      provider: "Jio AirFiber", 
      speed: "300Mbps", 
      price: "999", 
      validity: "30 days",
      data: "Unlimited",
      color: "from-purple-500 to-purple-600",
      icon: "fa-solid fa-tower-broadcast"
    },
    { 
      id: 3,
      provider: "Airtel Xstream", 
      speed: "200Mbps", 
      price: "799", 
      validity: "30 days",
      data: "Unlimited",
      color: "from-red-500 to-red-600",
      icon: "fa-solid fa-signal"
    },
    { 
      id: 4,
      provider: "ACT Fibernet", 
      speed: "150Mbps", 
      price: "599", 
      validity: "30 days",
      data: "Unlimited",
      color: "from-green-500 to-green-600",
      icon: "fa-solid fa-network-wired"
    },
  ]);

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

  const handleAddPlan = () => {
    const newPlan = {
      id: Date.now(),
      ...formData
    };
    setPlans([...plans, newPlan]);
    resetForm();
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

  const handleUpdatePlan = () => {
    setPlans(plans.map(plan => 
      plan.id === editingPlan 
        ? { ...plan, ...formData }
        : plan
    ));
    resetForm();
  };

  const handleDeletePlan = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(plan => plan.id !== id));
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
          <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8 pt-16 sm:pt-4 lg:pt-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Plans Management</h1>
                <p className="text-gray-600">Manage all broadband plans</p>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Add New Plan
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <i className={`${plan.icon} text-2xl`}></i>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="w-9 h-9 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="w-9 h-9 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.provider}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fa-solid fa-gauge text-indigo-600"></i>
                      <span className="text-sm">Speed: <strong>{plan.speed}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fa-solid fa-calendar text-indigo-600"></i>
                      <span className="text-sm">Validity: <strong>{plan.validity}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <i className="fa-solid fa-database text-indigo-600"></i>
                      <span className="text-sm">Data: <strong>{plan.data}</strong></span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Price</span>
                        <div className="text-2xl font-bold text-indigo-600">₹{plan.price}</div>
                      </div>
                      <button className={`px-4 py-2 bg-gradient-to-r ${plan.color} text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm`}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {plans.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-clipboard-list text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Plans Available</h3>
                <p className="text-gray-500 mb-6">Start by adding your first broadband plan</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Plus size={20} />
                  Add First Plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPlan ? "Edit Plan" : "Add New Plan"}
                </h2>
                <button
                  onClick={resetForm}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
                >
                  <XCircle size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Name</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., BSNL Fiber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Speed</label>
                  <input
                    type="text"
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 100Mbps"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 449"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Validity</label>
                  <input
                    type="text"
                    value={formData.validity}
                    onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 30 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Data</label>
                  <input
                    type="text"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color Theme</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPlan ? handleUpdatePlan : handleAddPlan}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
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