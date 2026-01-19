import React, { useState, useEffect } from "react";
import { Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Eye, MessageSquare, Menu } from "lucide-react";

// Sidebar Component
function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Complain');

  const handleNavClick = (path, href) => {
    setActiveItem(path);
    setMobileOpen(false);
  };

  const menuItems = [
    { icon: "fa-solid fa-house", label: "Home", path: "Home", href: "/" },
    { icon: "fa-solid fa-clipboard-list", label: "Plans", path: "Plans", href: "/plans" },
    { icon: "fa-solid fa-tag", label: "Offers", path: "Offers", href: "/offer" },
    { icon: "fa-solid fa-exclamation-circle", label: "Complain", path: "Complain", href: "/complain" },
    { icon: "fa-solid fa-gear", label: "Settings", path: "Settings", href: "/settings" },
    { icon: "fa-solid fa-right-from-bracket", label: "Logout", path: "Logout", href: "/logout" },
  ];

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md text-indigo-600 shadow-xl border border-white/40"
      >
        {mobileOpen ? <XCircle size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-r border-white/40 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2 pt-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/30">
              P
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PrimeDesk
            </h1>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path, item.href)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl w-full text-left transition-all duration-200 ${
                  activeItem === item.path
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
                }`}
              >
                <i className={item.icon}></i>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-gray-200/50">
            <div className="text-center text-xs text-gray-500 font-medium">
              Admin Panel
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Main Complaints Component
export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setComplaints([
        {
          id: 1,
          userName: "Rahul Sharma",
          email: "rahul.sharma@email.com",
          phone: "+91 98765 43210",
          subject: "Internet Connection Issue",
          description: "My internet connection has been very slow for the past 3 days. Speed is below 10 Mbps when I have a 100 Mbps plan.",
          status: "pending",
          priority: "high",
          date: "2025-01-18",
          provider: "Airtel"
        },
        {
          id: 2,
          userName: "Priya Patel",
          email: "priya.patel@email.com",
          phone: "+91 87654 32109",
          subject: "Billing Error",
          description: "I was charged twice for this month's subscription. Please refund the extra amount.",
          status: "in-progress",
          priority: "medium",
          date: "2025-01-17",
          provider: "Jio"
        },
        {
          id: 3,
          userName: "Amit Kumar",
          email: "amit.k@email.com",
          phone: "+91 76543 21098",
          subject: "Router Not Working",
          description: "The router provided by the company stopped working suddenly. Need replacement urgently.",
          status: "resolved",
          priority: "high",
          date: "2025-01-16",
          provider: "BSNL"
        },
        {
          id: 4,
          userName: "Sneha Reddy",
          email: "sneha.reddy@email.com",
          phone: "+91 65432 10987",
          subject: "Plan Upgrade Request",
          description: "I want to upgrade my plan from 50 Mbps to 100 Mbps. How can I do this?",
          status: "pending",
          priority: "low",
          date: "2025-01-18",
          provider: "Airtel"
        },
        {
          id: 5,
          userName: "Vikram Singh",
          email: "vikram.singh@email.com",
          phone: "+91 54321 09876",
          subject: "Frequent Disconnections",
          description: "Internet disconnects every 2-3 hours. This is affecting my work from home.",
          status: "in-progress",
          priority: "high",
          date: "2025-01-17",
          provider: "Jio"
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
        icon: Clock
      },
      "in-progress": {
        label: "In Progress",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        icon: AlertCircle
      },
      resolved: {
        label: "Resolved",
        color: "text-green-700 bg-green-50 border-green-200",
        icon: CheckCircle
      },
      rejected: {
        label: "Rejected",
        color: "text-red-700 bg-red-50 border-red-200",
        icon: XCircle
      }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-orange-600 bg-orange-50 border-orange-200",
      low: "text-blue-600 bg-blue-50 border-blue-200"
    };
    return configs[priority] || configs.medium;
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length
  };

  const handleStatusChange = (complaintId, newStatus) => {
    setComplaints(complaints.map(c => 
      c.id === complaintId ? { ...c, status: newStatus } : c
    ));
    setSelectedComplaint(null);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complaints Management</h1>
          <p className="text-gray-600">Monitor and manage user complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold mb-1">Total Complaints</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-semibold mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-900">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-semibold mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-900">{stats.resolved}</p>
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
                            <h3 className="font-bold text-gray-900 text-lg">{complaint.userName}</h3>
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getPriorityConfig(complaint.priority)}`}>
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
                          <h4 className="font-semibold text-blue-700 mb-2">{complaint.subject}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{complaint.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-sm text-gray-500">{complaint.date}</span>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold ${statusConfig.color}`}>
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
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Complaints Found</h3>
              <p className="text-gray-600">No complaints match your current filters</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
                >
                  <XCircle size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">User Name</label>
                  <p className="text-gray-900 font-medium">{selectedComplaint.userName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                    <p className="text-gray-900">{selectedComplaint.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone</label>
                    <p className="text-gray-900">{selectedComplaint.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Provider</label>
                    <p className="text-gray-900">{selectedComplaint.provider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Date</label>
                    <p className="text-gray-900">{selectedComplaint.date}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Subject</label>
                  <p className="text-blue-700 font-medium">{selectedComplaint.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedComplaint.description}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Update Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedComplaint.id, "pending")}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "pending"
                          ? "bg-yellow-600 text-white"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedComplaint.id, "in-progress")}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "in-progress"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedComplaint.id, "resolved")}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        selectedComplaint.status === "resolved"
                          ? "bg-green-600 text-white"
                          : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      }`}
                    >
                      Resolved
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedComplaint.id, "rejected")}
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