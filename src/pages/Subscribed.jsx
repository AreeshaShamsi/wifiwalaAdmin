import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

function Subscribed() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed to 20 per page
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async (subscription_id) => {
    setDeleting(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(
        `${BASE_URL}/api/plans/subscription/${subscription_id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setSubscriptions((subs) =>
          subs.filter((s) => s.subscription_id !== subscription_id),
        );
        setTotal((t) => t - 1);
      }
    } catch (error) {}
    setDeleting(false);
    setConfirmOpen(false);
    setDeleteId(null);
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const params = new URLSearchParams({
          page,
          limit,
          search,
        });
        const res = await fetch(
          `${BASE_URL}/api/plans/subscription/all?${params}`,
        );
        const data = await res.json();
        if (res.ok && data.subscriptions) {
          setSubscriptions(data.subscriptions);
          setTotal(data.total || 0);
        } else {
          setSubscriptions([]);
          setTotal(0);
        }
      } catch (error) {
        setSubscriptions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [page, limit, search]);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <>
      <Sidebar />
      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Subscribed Users</h1>
            {/* <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search name or mobile"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                style={{ minWidth: 200 }}
              />
             
            </div> */}
          </div>
          <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 font-semibold">Created Date</th>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Mobile</th>
                  <th className="px-4 py-2 font-semibold">Operator</th>
                  {/* <th className="px-4 py-2 font-semibold">Plan Description</th> */}
                  <th className="px-4 py-2 font-semibold">Plan Price</th>
                  <th className="px-4 py-2 font-semibold">Speed</th>
                  <th className="px-4 py-2 font-semibold">Data Limit</th>
                  {/* <th className="px-4 py-2 font-semibold">Start Date</th>
                  <th className="px-4 py-2 font-semibold">End Date</th> */}
                  <th className="px-4 py-2 font-semibold">Delete</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      No subscriptions found
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <tr
                      key={subscription.subscription_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">
                        {(() => {
                          const date = new Date(subscription.created_at);
                          const options = {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          };
                          return date
                            .toLocaleDateString("en-GB", options)
                            .replace(/ /g, " ");
                        })()}
                      </td>
                      <td className="px-4 py-2">{subscription.user_name}</td>
                      {/* <td className="px-4 py-2">{subscription.email}</td> */}
                      <td className="px-4 py-2">{subscription.phone_number}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {subscription.logo_url && (
                            <img
                              src={subscription.logo_url}
                              alt={subscription.operator_name}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <span>{subscription.operator_name}</span>
                        </div>
                      </td>
                      {/* <td className="px-4 py-2">
                          {subscription.plan_description}
                        </td> */}
                      <td className="px-4 py-2">
                        <span className="text-green-600 font-semibold">
                          ₹{subscription.plan_price}
                        </span>
                      </td>
                      <td className="px-4 py-2">{subscription.speed}</td>
                      <td className="px-4 py-2">{subscription.data_limit}</td>

                      <td className="px-4 py-2">
                        <button
                          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                          onClick={() => {
                            setDeleteId(subscription.subscription_id);
                            setConfirmOpen(true);
                          }}
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Showing {subscriptions.length} of {total} subscriptions
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 text-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>
                <span className="px-2 text-sm font-semibold">Page {page}</span>
                <button
                  className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 text-sm"
                  disabled={page * limit >= total}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup - moved outside for fullscreen overlay */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this subscription?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setConfirmOpen(false);
                  setDeleteId(null);
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Subscribed;
