import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const Plans = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plans/operators`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch operators");
      }

      const data = await response.json();
      setOperators(data.operators || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching operators:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <Sidebar />
        <div className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading operators...</p>
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
              <p className="text-lg font-semibold mb-2">
                Error Loading Operators
              </p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchOperators}
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6 pt-16 sm:pt-4 lg:pt-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Plans Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage operators and their plans
              </p>
            </div>
          </div>

          {/* Operators Section */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Network Operators
            </h2>

            {operators.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📡</span>
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No Operators Found
                </h3>
                <p className="text-sm text-gray-500">
                  No network operators available at the moment
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {operators.map((operator) => (
                  <div
                    key={operator.id}
                    className={`bg-white rounded-lg p-4 border-2 shadow-md hover:shadow-xl transition-all ${
                      operator.active
                        ? "border-green-200"
                        : "border-gray-200 opacity-60"
                    }`}
                  >
                    {/* Operator Logo */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {operator.logo_url ? (
                          <img
                            src={operator.logo_url}
                            alt={operator.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-indigo-600">
                            {operator.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-800 mb-1 truncate">
                          {operator.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded inline-block">
                          {operator.code}
                        </p>
                      </div>
                    </div>

                    {operator.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {operator.description}
                      </p>
                    )}

                    {/* Status & Actions */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            operator.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {operator.active ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => navigate(`/plans/${operator.id}`)}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md font-medium hover:opacity-90 transition-all text-xs"
                        >
                          View Plans
                        </button>
                      </div>
                    </div>

                    {/* Created Date */}
                    {/* {operator.created_at && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          Added:{" "}
                          {new Date(operator.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
