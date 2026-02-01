import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Menu,
} from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
// Sidebar Component

// Main Complaints Component
export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/admin/all`,
      );
      const result = await response.json();

      if (response.ok && result.success) {
        // Transform the API response to match our component structure
        const transformedComplaints = result.complaints.map((complaint) => ({
          id: complaint.complaint_id,
          userName: complaint.user_name,
          email: complaint.email,
          phone: complaint.phone_number,
          subject: complaint.subject,
          description: complaint.description,
          status: complaint.status,
          priority: complaint.priority,
          date: new Date(complaint.created_at).toLocaleDateString("en-CA"), // YYYY-MM-DD format
          provider: "WiFiWala", // Default provider since it's not in the complaints table
        }));
        setComplaints(transformedComplaints);
      } else {
        console.error("Failed to fetch complaints:", result.message);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
        icon: Clock,
      },
      "in-progress": {
        label: "In Progress",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        icon: AlertCircle,
      },
      resolved: {
        label: "Resolved",
        color: "text-green-700 bg-green-50 border-green-200",
        icon: CheckCircle,
      },
      rejected: {
        label: "Rejected",
        color: "text-red-700 bg-red-50 border-red-200",
        icon: XCircle,
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-orange-600 bg-orange-50 border-orange-200",
      low: "text-blue-600 bg-blue-50 border-blue-200",
    };
    return configs[priority] || configs.medium;
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the local state
        setComplaints(
          complaints.map((c) =>
            c.id === complaintId ? { ...c, status: newStatus } : c,
          ),
        );

        // Update the selected complaint if it's the one being changed
        if (selectedComplaint && selectedComplaint.id === complaintId) {
          setSelectedComplaint({ ...selectedComplaint, status: newStatus });
        }

        console.log("Status updated successfully");
      } else {
        console.error("Failed to update status:", result.message);
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="lg:ml-64 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complaints Management
          </h1>
          <p className="text-gray-600">Monitor and manage user complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold mb-1">
                  Total Complaints
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-semibold mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-900">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold mb-1">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-semibold mb-1">
                  Resolved
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.resolved}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, subject, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => {
              const statusConfig = getStatusConfig(complaint.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={complaint.id}
                  className="bg-white border border-blue-100 rounded-xl p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {complaint.userName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {complaint.userName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-semibold border ${getPriorityConfig(complaint.priority)}`}
                            >
                              {complaint.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                            <span>{complaint.email}</span>
                            <span>•</span>
                            <span>{complaint.phone}</span>
                            <span>•</span>
                            <span>{complaint.provider}</span>
                          </div>
                          <h4 className="font-semibold text-blue-700 mb-2">
                            {complaint.subject}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {complaint.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-sm text-gray-500">
                        {complaint.date}
                      </span>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-blue-50 rounded-xl border border-blue-100">
              <MessageSquare className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                No Complaints Found
              </h3>
              <p className="text-gray-600">
                No complaints match your current filters
              </p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Complaint Details
                </h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
                >
                  <XCircle size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    User Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedComplaint.userName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedComplaint.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedComplaint.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Provider
                    </label>
                    <p className="text-gray-900">
                      {selectedComplaint.provider}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      Date
                    </label>
                    <p className="text-gray-900">{selectedComplaint.date}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Subject
                  </label>
                  <p className="text-blue-700 font-medium">
                    {selectedComplaint.subject}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Description
                  </label>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Update Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleStatusChange(selectedComplaint.id, "pending")
                      }
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "pending"
                          ? "bg-yellow-600 text-white"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedComplaint.id, "in-progress")
                      }
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "in-progress"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedComplaint.id, "resolved")
                      }
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "resolved"
                          ? "bg-green-600 text-white"
                          : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      }`}
                    >
                      Resolved
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedComplaint.id, "rejected")
                      }
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      }`}
                    >
                      Rejected
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
