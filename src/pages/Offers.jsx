import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Calendar } from "lucide-react";


// Modal Component - Moved outside to prevent recreation on every render
const OfferModal = ({
  isOpen,
  onClose,
  isEdit = false,
  formData,
  handleInputChange,
  handleSubmit,
  handleUpdate,
  formLoading,
  plans,
  operators,
  getOperatorName,
  formatSpeed,
  getPlanOperatorName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {isEdit ? "Edit Offer" : "Create New Offer"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={isEdit ? handleUpdate : handleSubmit}
          className="p-6 space-y-4"
        >
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan *
            </label>
            <select
              name="plan_id"
              value={formData.plan_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan.plan_id} value={plan.plan_id}>
                  {getOperatorName(plan.operator_id)}-₹{plan.price}-
                  {formatSpeed(plan.speed)}
                </option>
              ))}
            </select>
          </div>

          {/* Offer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Name *
            </label>
            <input
              type="text"
              name="offer_name"
              value={formData.offer_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Summer Special Discount"
              required
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Offer description..."
              autoComplete="off"
            />
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={
                  formData.discount_type === "percentage" ? "10" : "100"
                }
                min="0"
                step="0.01"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* Max Discount (only for percentage) */}
          {formData.discount_type === "percentage" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount Amount (₹)
              </label>
              <input
                type="number"
                name="max_discount"
                value={formData.max_discount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="500"
                min="0"
                step="0.01"
                autoComplete="off"
              />
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Offer is active
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {formLoading
                ? "Saving..."
                : isEdit
                  ? "Update Offer"
                  : "Create Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOfferId, setEditOfferId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    plan_id: "",
    offer_name: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    max_discount: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    fetchOffers();
    fetchPlans();
    fetchOperators();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/offers`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }

      const data = await response.json();
      setOffers(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plans`);

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plans/operators`);

      if (!response.ok) {
        throw new Error("Failed to fetch operators");
      }

      const data = await response.json();
      setOperators(data.operators || []);
    } catch (err) {
      console.error("Error fetching operators:", err);
    }
  };

  const resetFormData = () => {
    setFormData({
      plan_id: "",
      offer_name: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      max_discount: "",
      start_date: "",
      end_date: "",
      is_active: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Validation
      if (
        !formData.plan_id ||
        !formData.offer_name ||
        !formData.discount_value ||
        !formData.start_date ||
        !formData.end_date
      ) {
        alert("Please fill in all required fields");
        setFormLoading(false);
        return;
      }

      const offerData = {
        plan_id: parseInt(formData.plan_id),
        offer_name: formData.offer_name,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_discount: formData.max_discount
          ? parseFloat(formData.max_discount)
          : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/offers/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        throw new Error("Failed to create offer");
      }

      resetFormData();
      setShowAddModal(false);
      await fetchOffers();
    } catch (err) {
      console.error("Error creating offer:", err);
      alert("Failed to create offer. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (offer) => {
    setFormData({
      plan_id: offer.plan_id,
      offer_name: offer.offer_name,
      description: offer.offer_description || "",
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      max_discount: offer.max_discount || "",
      start_date: offer.start_date ? offer.start_date.split("T")[0] : "",
      end_date: offer.end_date ? offer.end_date.split("T")[0] : "",
      is_active: offer.is_active,
    });
    setEditOfferId(offer.offer_id);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const offerData = {
        plan_id: parseInt(formData.plan_id),
        offer_name: formData.offer_name,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_discount: formData.max_discount
          ? parseFloat(formData.max_discount)
          : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/offers/${editOfferId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(offerData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update offer");
      }

      setShowEditModal(false);
      setEditOfferId(null);
      await fetchOffers();
    } catch (err) {
      console.error("Error updating offer:", err);
      alert("Failed to update offer. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this offer? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/offers/${offerId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete offer");
      }

      await fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
      alert("Failed to delete offer. Please try again.");
    }
  };

  const toggleOfferStatus = async (offerId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/offers/${offerId}/toggle-status`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to toggle offer status");
      }

      await fetchOffers();
    } catch (err) {
      console.error("Error toggling offer status:", err);
      alert("Failed to toggle offer status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDiscount = (offer) => {
    if (offer.discount_type === "percentage") {
      return `${offer.discount_value}%${offer.max_discount ? ` (Max ₹${offer.max_discount})` : ""}`;
    }
    return `₹${offer.discount_value}`;
  };

  const isOfferActive = (offer) => {
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);
    return offer.is_active && now >= startDate && now <= endDate;
  };

  const getOperatorName = (operatorId) => {
    const operator = operators.find((op) => op.id === operatorId);
    return operator ? operator.name : `Operator ${operatorId}`;
  };

  const getPlanOperatorName = (planId) => {
    const plan = plans.find((p) => p.plan_id === planId);
    if (plan) {
      return getOperatorName(plan.operator_id);
    }
    return "Unknown Operator";
  };

  const formatSpeed = (speed) => {
    if (!speed) return "";
    // Extract numeric value and convert to consistent format
    const speedMatch = speed.match(/([0-9.]+)\s*(gb|mb|kb)?/i);
    if (speedMatch) {
      const value = parseFloat(speedMatch[1]);
      const unit = speedMatch[2] ? speedMatch[2].toLowerCase() : "mb";

      if (unit === "gb" || unit === "gbps") {
        return `${value * 1000}mbps`;
      } else if (unit === "kb" || unit === "kbps") {
        return `${value / 1000}mbps`;
      } else {
        return `${value}mbps`;
      }
    }
    return speed.toLowerCase().replace(/\s+/g, "");
  };

  // If loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        
        <div className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading offers...</p>
          </div>
        </div>
      </div>
    );
  }

  // If error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        
        <div className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-red-200 shadow-lg max-w-md">
            <div className="text-red-600 text-center">
              <p className="text-lg font-semibold mb-2">Error Loading Offers</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchOffers}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
    

      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6 pt-16 sm:pt-4 lg:pt-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Offers Management
              </h1>
              <p className="text-sm text-gray-600">
                Create and manage special offers for your plans
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Offer
            </button>
          </div>

          {/* Offers List */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/50 shadow-lg">
            {offers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Offers Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Start creating offers to boost your sales
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Create First Offer
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Offer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Plan
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Discount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer) => (
                      <tr
                        key={offer.offer_id}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">
                              {offer.offer_name}
                            </p>
                            {offer.offer_description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {offer.offer_description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-gray-800 font-medium">
                              {getPlanOperatorName(offer.plan_id)} -{" "}
                              {offer.speed}
                            </p>
                            <p className="text-xs text-gray-500">
                              {offer.data_limit} • ₹
                              {offer.plan_price || offer.price} •{" "}
                              {offer.validity} days
                            </p>
                            {offer.plan_description && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {offer.plan_description.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-green-600">
                            {formatDiscount(offer)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs">
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(offer.start_date)}
                            </p>
                            <p className="text-gray-500 ml-4">
                              to {formatDate(offer.end_date)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                offer.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {offer.is_active ? "Active" : "Inactive"}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isOfferActive(offer)
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {isOfferActive(offer) ? "Running" : "Scheduled"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleOfferStatus(offer.offer_id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                              title={
                                offer.is_active ? "Deactivate" : "Activate"
                              }
                            >
                              {offer.is_active ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditClick(offer)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(offer.offer_id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <OfferModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetFormData();
        }}
        isEdit={false}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdate}
        formLoading={formLoading}
        plans={plans}
        operators={operators}
        getOperatorName={getOperatorName}
        formatSpeed={formatSpeed}
        getPlanOperatorName={getPlanOperatorName}
      />

      <OfferModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditOfferId(null);
          resetFormData();
        }}
        isEdit={true}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdate}
        formLoading={formLoading}
        plans={plans}
        operators={operators}
        getOperatorName={getOperatorName}
        formatSpeed={formatSpeed}
        getPlanOperatorName={getPlanOperatorName}
      />
    </div>
  );
};

export default Offers;
