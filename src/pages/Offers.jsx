import React, { useState } from 'react';
import { Plus, Edit2, Trash2, XCircle, Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';

// Sidebar Component

// Main Offers Page Component
const OfferManagementPage = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "20% Off First Recharge",
      description: "Get 20% discount on your first mobile recharge",
      discount: "20%",
      color: "from-blue-500 to-blue-600",
      icon: "fa-solid fa-tag",
      updated: "last week"
    },
    {
      id: 2,
      title: "Flat ₹50 Cashback",
      description: "Cashback on recharges above ₹500",
      discount: "₹50",
      color: "from-orange-500 to-orange-600",
      icon: "fa-solid fa-wallet",
      updated: "last month"
    },
    {
      id: 3,
      title: "Premium Plan 30% Off",
      description: "Special discount on annual premium plans",
      discount: "30%",
      color: "from-pink-500 to-pink-600",
      icon: "fa-solid fa-star",
      updated: "last week"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    color: 'from-blue-500 to-blue-600',
    icon: 'fa-solid fa-tag'
  });

  const colorOptions = [
    { value: 'from-blue-500 to-blue-600', label: 'Blue' },
    { value: 'from-orange-500 to-orange-600', label: 'Orange' },
    { value: 'from-pink-500 to-pink-600', label: 'Pink' },
    { value: 'from-green-500 to-green-600', label: 'Green' },
    { value: 'from-purple-500 to-purple-600', label: 'Purple' },
    { value: 'from-red-500 to-red-600', label: 'Red' }
  ];

  const iconOptions = [
    { value: 'fa-solid fa-tag', label: 'Tag' },
    { value: 'fa-solid fa-wallet', label: 'Wallet' },
    { value: 'fa-solid fa-star', label: 'Star' },
    { value: 'fa-solid fa-gift', label: 'Gift' },
    { value: 'fa-solid fa-bolt', label: 'Bolt' },
    { value: 'fa-solid fa-fire', label: 'Fire' }
  ];

  const handleAddOffer = () => {
    const newOffer = {
      id: Date.now(),
      ...formData,
      updated: 'just now'
    };
    setOffers([...offers, newOffer]);
    resetForm();
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      color: offer.color,
      icon: offer.icon
    });
    setShowAddModal(true);
  };

  const handleUpdateOffer = () => {
    setOffers(offers.map(offer => 
      offer.id === editingOffer 
        ? { ...offer, ...formData, updated: 'just now' }
        : offer
    ));
    resetForm();
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      color: 'from-blue-500 to-blue-600',
      icon: 'fa-solid fa-tag'
    });
    setShowAddModal(false);
    setEditingOffer(null);
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Offers Management</h1>
                <p className="text-gray-600">Manage all promotional offers</p>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Add New Offer
              </button>
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${offer.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <i className={`${offer.icon} text-2xl`}></i>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditOffer(offer)}
                        className="w-9 h-9 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="w-9 h-9 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className={`text-4xl font-bold bg-gradient-to-r ${offer.color} bg-clip-text text-transparent mb-3`}>
                      {offer.discount}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        Updated {offer.updated}
                      </span>
                      <button className={`px-4 py-2 bg-gradient-to-r ${offer.color} text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm`}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {offers.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-tags text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Offers Available</h3>
                <p className="text-gray-500 mb-6">Start by adding your first promotional offer</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Plus size={20} />
                  Add First Offer
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
                  {editingOffer ? "Edit Offer" : "Add New Offer"}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 20% Off First Recharge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Offer description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Discount</label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 20% or ₹50"
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
                  onClick={editingOffer ? handleUpdateOffer : handleAddOffer}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingOffer ? "Update Offer" : "Add Offer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OfferManagementPage;