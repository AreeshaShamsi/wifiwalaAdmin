import React, { useEffect, useState } from "react";


function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    email: "",
    address: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add money to wallet handler
  const handleAddMoney = async (user) => {
    setSelectedUser(user);
    setWalletAmount(user.wallet || 0);
    setShowWalletModal(true);
  };

  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    if (walletAmount === "" || parseFloat(walletAmount) < 0) {
      alert("Please enter a valid amount");
      return;
    }
    setWalletLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${BASE_URL}/api/auth/wallet/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.user_id,
          amount: parseFloat(walletAmount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowWalletModal(false);
        setWalletAmount("");
        setSelectedUser(null);
        fetchUsers();
        alert(
          `Successfully added ₹${walletAmount} to ${selectedUser.name}'s wallet`,
        );
      } else {
        alert(data.message || "Failed to add money");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setWalletLoading(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${BASE_URL}/api/auth/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  const fetchUsers = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${BASE_URL}/api/auth/admin/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !form.name ||
      !form.phone_number ||
      !form.email ||
      !form.address ||
      !form.password
    ) {
      setFormError("All fields are required");
      return;
    }
    setFormLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          mobile: form.phone_number,
          email: form.email,
          address: form.address,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setForm({
          name: "",
          phone_number: "",
          email: "",
          address: "",
          password: "",
        });
        fetchUsers();
      } else {
        setFormError(data.message || "Failed to add user");
      }
    } catch (err) {
      setFormError("Server error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <>
      
      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Users</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              + Add User
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 font-semibold">S.No</th>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Mobile</th>
                  <th className="px-4 py-2 font-semibold">Email</th>
                  <th className="px-4 py-2 font-semibold">Address</th>
                  <th className="px-4 py-2 font-semibold">Wallet</th>
                  <th className="px-4 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr
                      key={user.user_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.phone_number}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.address}</td>
                      <td className="px-4 py-2">
                        <span className="text-green-600 font-semibold">
                          ₹{user.wallet || 0}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                            onClick={() => handleAddMoney(user)}
                          >
                            Add Money
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            onClick={() => handleDeleteUser(user.user_id)}
                          >
                            Delete
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
      </div>
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            {formError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
                {formError}
              </div>
            )}
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone_number: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    })
                  }
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                  onClick={() => setShowAddModal(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Update {selectedUser?.name}'s Wallet
            </h2>
            <form onSubmit={handleWalletSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Current Balance: ₹{selectedUser?.wallet || 0}
                </label>
                <label className="block text-sm font-semibold mb-1">
                  Set New Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                  onClick={() => {
                    setShowWalletModal(false);
                    setWalletAmount("");
                    setSelectedUser(null);
                  }}
                  disabled={walletLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  disabled={walletLoading}
                >
                  {walletLoading ? "Adding..." : "Add Money"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
