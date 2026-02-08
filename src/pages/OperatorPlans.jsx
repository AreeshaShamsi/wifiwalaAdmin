import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, X } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";

const OperatorPlans = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ottPlatforms, setOttPlatforms] = useState([]);
  const [formData, setFormData] = useState({
    price: "",
    validity: "",
    speedValue: "",
    speedUnit: "Mbps",
    dataLimitValue: "",
    dataLimitUnit: "GB",
    ott_platforms: [],
    is_active: true,
    description: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlanId, setEditPlanId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchOperatorAndPlans();
    fetchOTTPlatforms();
  }, [id]);

  const fetchOperatorAndPlans = async () => {
    try {
      setLoading(true);

      // Fetch operator details
      const operatorResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plans/operators`,
      );
      if (!operatorResponse.ok) {
        throw new Error("Failed to fetch operator details");
      }
      const operatorData = await operatorResponse.json();
      const currentOperator = operatorData.operators.find(
        (op) => op.id === parseInt(id),
      );
      setOperator(currentOperator);

      // Fetch plans for this operator
      const plansResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plans?operator_id=${id}`,
      );
      if (!plansResponse.ok) {
        throw new Error("Failed to fetch plans");
      }
      const plansData = await plansResponse.json();
      setPlans(plansData.plans || []);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOTTPlatforms = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plans/ott-platforms`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch OTT platforms");
      }
      const data = await response.json();
      setOttPlatforms(data.ottPlatforms || []);
    } catch (err) {
      console.error("Error fetching OTT platforms:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDataLimitValueChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      dataLimitValue: e.target.value,
    }));
  };

  const handleDataLimitUnitChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      dataLimitUnit: e.target.value,
    }));
  };

  const handleSpeedValueChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      speedValue: e.target.value,
    }));
  };

  const handleSpeedUnitChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      speedUnit: e.target.value,
    }));
  };

  const handleOTTChange = (ottId) => {
    setFormData((prev) => {
      const currentOTTs = prev.ott_platforms;
      const isSelected = currentOTTs.includes(ottId);

      return {
        ...prev,
        ott_platforms: isSelected
          ? currentOTTs.filter((id) => id !== ottId)
          : [...currentOTTs, ottId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let data_limit = "";
      if (formData.dataLimitUnit === "Unlimited") {
        data_limit = "Unlimited";
      } else if (formData.dataLimitValue && formData.dataLimitUnit) {
        data_limit = `${formData.dataLimitValue} ${formData.dataLimitUnit}`;
      }

      const planData = {
        operator_id: parseInt(id),
        price: parseFloat(formData.price),
        validity: parseInt(formData.validity),
        speed:
          formData.speedValue && formData.speedUnit
            ? `${formData.speedValue} ${formData.speedUnit}`
            : "",
        data_limit,
        ott_platforms: formData.ott_platforms,
        description: formData.description || "",
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plans/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error("Failed to create plan");
      }

      // Reset form and close modal
      setFormData({
        price: "",
        validity: "",
        speedValue: "",
        speedUnit: "Mbps",
        dataLimitValue: "",
        dataLimitUnit: "GB",
        ott_platforms: [],
        is_active: true,
        description: "",
      });
      setShowAddModal(false);

      // Refresh plans list
      await fetchOperatorAndPlans();
    } catch (err) {
      console.error("Error creating plan:", err);
      alert("Failed to create plan. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit Plan logic
  const handleEditClick = (plan) => {
    // Parse speed and data_limit fields
    let speedValue = "";
    let speedUnit = "Mbps";
    if (plan.speed) {
      const speedParts = plan.speed.split(" ");
      speedValue = speedParts[0] || "";
      speedUnit = speedParts[1] || "Mbps";
    }
    let dataLimitValue = "";
    let dataLimitUnit = "GB";
    if (plan.data_limit === "Unlimited") {
      dataLimitValue = "";
      dataLimitUnit = "Unlimited";
    } else if (plan.data_limit) {
      const dataParts = plan.data_limit.split(" ");
      dataLimitValue = dataParts[0] || "";
      dataLimitUnit = dataParts[1] || "GB";
    }
    setFormData({
      price: plan.price,
      validity: plan.validity,
      speedValue,
      speedUnit,
      dataLimitValue,
      dataLimitUnit,
      ott_platforms: plan.ott_platforms
        ? plan.ott_platforms.map((ott) => ott.ott_id)
        : [],
      is_active: plan.is_active !== undefined ? plan.is_active : true,
      description: plan.description || "",
    });
    setEditPlanId(plan.plan_id);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let data_limit = "";
      if (formData.dataLimitUnit === "Unlimited") {
        data_limit = "Unlimited";
      } else if (formData.dataLimitValue && formData.dataLimitUnit) {
        data_limit = `${formData.dataLimitValue} ${formData.dataLimitUnit}`;
      }
      const planData = {
        price: parseFloat(formData.price),
        validity: parseInt(formData.validity),
        speed:
          formData.speedValue && formData.speedUnit
            ? `${formData.speedValue} ${formData.speedUnit}`
            : "",
        data_limit,
        ott_platforms: formData.ott_platforms,
        description: formData.description || "",
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plans/update/${editPlanId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(planData),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update plan");
      }
      setShowEditModal(false);
      setEditPlanId(null);
      // Refresh plans list
      await fetchOperatorAndPlans();
    } catch (err) {
      console.error("Error updating plan:", err);
      alert("Failed to update plan. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Plan logic
  const handleDelete = async (planId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this plan? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plans/delete/${planId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete plan");
      }

      // Refresh plans list
      await fetchOperatorAndPlans();
    } catch (err) {
      console.error("Error deleting plan:", err);
      alert("Failed to delete plan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <Sidebar />
        <div className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <Sidebar />
        <div className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-red-200 shadow-lg max-w-md">
            <div className="text-red-600 text-center">
              <p className="text-lg font-semibold mb-2">Error Loading Plans</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchOperatorAndPlans}
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
      <Sidebar />

      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          {/* Back Button & Header */}
          <div className="flex flex-col gap-4 mb-4 lg:mb-6 pt-16 sm:pt-4 lg:pt-0">
            <button
              onClick={() => navigate("/plans")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium w-fit"
            >
              <ArrowLeft size={20} />
              Back to Operators
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                {operator?.logo_url && (
                  <div className="w-16 h-16 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
                    <img
                      src={operator.logo_url}
                      alt={operator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {operator?.name || "Operator"} Plans
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage plans for this operator
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormData({
                    price: "",
                    validity: "",
                    speedValue: "",
                    speedUnit: "Mbps",
                    dataLimitValue: "",
                    dataLimitUnit: "GB",
                    ott_platforms: [],
                    is_active: true,
                    description: "",
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              >
                <Plus size={18} />
                Add New Plan
              </button>
            </div>
          </div>

          {/* Plans Table */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Available Plans ({plans.length})
            </h2>

            {plans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No Plans Found
                </h3>
                <p className="text-sm text-gray-500">
                  No plans available for this operator yet
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm"
                >
                  Create First Plan
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-indigo-200">
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Validity
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Speed
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Data Limit
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        OTT Platforms
                      </th>
                      {/* <th className="text-left p-3 font-semibold text-gray-700">
                        Status
                      </th> */}
                      <th className="text-center p-3 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan, index) => (
                      <tr
                        key={plan.plan_id}
                        className={`border-b border-gray-200 hover:bg-indigo-50/50 transition-colors ${
                          index % 2 === 0 ? "bg-white/50" : "bg-gray-50/30"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-bold text-indigo-600">
                            ₹{plan.price}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-gray-700">
                            {plan.validity} days
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-gray-700">{plan.speed}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-gray-700">
                            {plan.data_limit || "Unlimited"}
                          </span>
                        </td>
                        <td className="p-3">
                          {plan.ott_platforms &&
                          plan.ott_platforms.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {plan.ott_platforms.map((ott) => (
                                <span
                                  key={ott.ott_id}
                                  className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium"
                                >
                                  {ott.ott_name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </td>
                        {/* <td className="p-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${
                                plan.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {plan.is_active ? "Active" : "Inactive"}
                            </span>
                          </td> */}
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-md flex items-center justify-center transition-all"
                              onClick={() => handleEditClick(plan)}
                            >
                              <Edit2 size={14} className="text-blue-600" />
                            </button>
                            <button
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-md flex items-center justify-center transition-all"
                              onClick={() => handleDelete(plan.plan_id)}
                            >
                              <Trash2 size={14} className="text-red-600" />
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

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Edit Plan</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  Update plan for {operator?.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditPlanId(null);
                }}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="499"
                  />
                </div>

                {/* Validity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Validity (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="30"
                  />
                </div>

                {/* Speed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speed <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="speedValue"
                      value={formData.speedValue}
                      onChange={handleSpeedValueChange}
                      required
                      min="1"
                      className="w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="100"
                    />
                    <select
                      name="speedUnit"
                      value={formData.speedUnit}
                      onChange={handleSpeedUnitChange}
                      className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="Mbps">Mbps</option>
                      <option value="MBps">MBps</option>
                      <option value="Gbps">Gbps</option>
                    </select>
                  </div>
                </div>

                {/* Data Limit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Limit
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="dataLimitValue"
                      value={formData.dataLimitValue}
                      onChange={handleDataLimitValueChange}
                      min="1"
                      disabled={formData.dataLimitUnit === "Unlimited"}
                      className="w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="100"
                    />
                    <select
                      name="dataLimitUnit"
                      value={formData.dataLimitUnit}
                      onChange={handleDataLimitUnitChange}
                      className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="GB">GB</option>
                      <option value="MB">MB</option>
                      <option value="TB">TB</option>
                      <option value="Unlimited">Unlimited</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* OTT Platforms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  OTT Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  {ottPlatforms.length > 0 ? (
                    ottPlatforms.map((ott) => (
                      <label
                        key={ott.ott_id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData.ott_platforms.includes(ott.ott_id)}
                          onChange={() => handleOTTChange(ott.ott_id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          {ott.ott_name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 col-span-full text-center py-2">
                      No OTT platforms available
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select OTT platforms included with this plan
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  htmlFor="plan-description-edit"
                >
                  Description
                </label>
                <textarea
                  id="plan-description-edit"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter plan description (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a short description for this plan (optional)
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditPlanId(null);
                  }}
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      Update Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Add New Plan</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  Create a new plan for {operator?.name}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="499"
                  />
                </div>

                {/* Validity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Validity (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="30"
                  />
                </div>

                {/* Speed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speed <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="speedValue"
                      value={formData.speedValue}
                      onChange={handleSpeedValueChange}
                      required
                      min="1"
                      className="w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="100"
                    />
                    <select
                      name="speedUnit"
                      value={formData.speedUnit}
                      onChange={handleSpeedUnitChange}
                      className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="Mbps">Mbps</option>
                      <option value="MBps">MBps</option>
                      <option value="Gbps">Gbps</option>
                    </select>
                  </div>
                </div>

                {/* Data Limit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Limit
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="dataLimitValue"
                      value={formData.dataLimitValue}
                      onChange={handleDataLimitValueChange}
                      min="1"
                      disabled={formData.dataLimitUnit === "Unlimited"}
                      className="w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="100"
                    />
                    <select
                      name="dataLimitUnit"
                      value={formData.dataLimitUnit}
                      onChange={handleDataLimitUnitChange}
                      className="w-1/3 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="GB">GB</option>
                      <option value="MB">MB</option>
                      <option value="TB">TB</option>
                      <option value="Unlimited">Unlimited</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* OTT Platforms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  OTT Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  {ottPlatforms.length > 0 ? (
                    ottPlatforms.map((ott) => (
                      <label
                        key={ott.ott_id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData.ott_platforms.includes(ott.ott_id)}
                          onChange={() => handleOTTChange(ott.ott_id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          {ott.ott_name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 col-span-full text-center py-2">
                      No OTT platforms available
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select OTT platforms included with this plan
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  htmlFor="plan-description"
                >
                  Description
                </label>
                <textarea
                  id="plan-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter plan description (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a short description for this plan (optional)
                </p>
              </div>

              {/* Active Status removed as per request */}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorPlans;
