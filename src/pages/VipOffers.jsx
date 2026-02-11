import React, { useState, useEffect } from "react";


const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const API_CREATE_URL = `${BASE_URL}/api/vip-plans/create`;
export const API_READ_URL = `${BASE_URL}/api/vip-plans`;
export const API_UPDATE_URL = `${BASE_URL}/api/vip-plans/update`;
export const API_DELETE_URL = `${BASE_URL}/api/vip-plans/delete`;

const OTT_OPTIONS = [
  "Netflix",
  "Amazon Prime",
  "Disney+ Hotstar",
  "Sony LIV",
  "Zee5",
  "Apple TV+",
];

const VIPPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    plan_name: "",
    description: "",
    speed_mbps: "",
    data_policy: "",
    validity_days: "",
    ott_platforms: [],
    additional_benefits: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_READ_URL);
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      alert("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, plan = null) => {
    setModalMode(mode);
    setSelectedPlan(plan);
    setImageFile(null);
    setImagePreview(null);

    if ((mode === "update" || mode === "view") && plan) {
      setFormData({
        plan_name: plan.plan_name || "",
        description: plan.description || "",
        speed_mbps: plan.speed_mbps || "",
        data_policy: plan.data_policy || "",
        validity_days: plan.validity_days || "",
        ott_platforms: Array.isArray(plan.ott_platforms)
          ? plan.ott_platforms
          : [],
        additional_benefits: Array.isArray(plan.additional_benefits)
          ? plan.additional_benefits.join(", ")
          : "",
      });

      if (plan.image_url) {
        setImagePreview(`${BASE_URL}${plan.image_url}`);
      }
    } else {
      setFormData({
        plan_name: "",
        description: "",
        speed_mbps: "",
        data_policy: "",
        validity_days: "",
        ott_platforms: [],
        additional_benefits: "",
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  const handleOTTChange = (ott) => {
    setFormData((prev) => ({
      ...prev,
      ott_platforms: prev.ott_platforms.includes(ott)
        ? prev.ott_platforms.filter((o) => o !== ott)
        : [...prev.ott_platforms, ott],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("plan_name", formData.plan_name);
      fd.append("description", formData.description);
      fd.append("speed_mbps", formData.speed_mbps);
      fd.append("data_policy", formData.data_policy);
      fd.append("validity_days", formData.validity_days);
      fd.append("ott_platforms", JSON.stringify(formData.ott_platforms));

      if (formData.additional_benefits) {
        fd.append(
          "additional_benefits",
          JSON.stringify(
            formData.additional_benefits
              .split(",")
              .map((b) => b.trim())
              .filter(Boolean),
          ),
        );
      }

      if (imageFile) fd.append("image", imageFile);

      const url =
        modalMode === "create"
          ? API_CREATE_URL
          : `${API_UPDATE_URL}/${selectedPlan.id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Save failed");

      await fetchPlans();
      closeModal();
      alert("Plan saved successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatArray = (arr) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "N/A";

  return (
    <div className="flex min-h-screen bg-white">
      
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">VIP Plans</h1>
          <button
            onClick={() => openModal("create")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Plan
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Plan</th>
              <th>OTT</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={p.id} className="border-t">
                <td>{i + 1}</td>
                <td>{p.plan_name}</td>
                <td>{formatArray(p.ott_platforms)}</td>
                <td>
                  <button onClick={() => openModal("view", p)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-xl">
              <h2 className="text-xl font-bold mb-4">
                {modalMode === "create" ? "Create Plan" : "Update Plan"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Plan Name"
                  value={formData.plan_name}
                  onChange={(e) =>
                    setFormData({ ...formData, plan_name: e.target.value })
                  }
                  required
                  className="w-full border p-2"
                />

                {/* OTT MULTI SELECT */}
                <div>
                  <p className="font-medium mb-2">OTT Platforms</p>
                  <div className="grid grid-cols-2 gap-2">
                    {OTT_OPTIONS.map((ott) => (
                      <label key={ott} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={formData.ott_platforms.includes(ott)}
                          onChange={() => handleOTTChange(ott)}
                        />
                        {ott}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Save
                </button>
              </form>

              <button onClick={closeModal} className="mt-4 text-gray-500">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPPlans;
