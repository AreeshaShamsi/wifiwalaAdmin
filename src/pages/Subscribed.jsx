import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

function Subscribed() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for subscriptions
  const dummySubscriptions = [
    {
      subscription_id: 1,
      user_name: "John Doe",
      phone_number: "9876543210",
      plan_name: "Premium",
      price: 599,
      speed: "50 Mbps",
      subscribed_date: "2026-01-15",
      status: "active",
    },
    {
      subscription_id: 2,
      user_name: "Jane Smith",
      phone_number: "9876543211",
      plan_name: "Basic",
      price: 299,
      speed: "25 Mbps",
      subscribed_date: "2026-01-10",
      status: "active",
    },
    {
      subscription_id: 3,
      user_name: "Mike Johnson",
      phone_number: "9876543212",
      plan_name: "Ultra",
      price: 999,
      speed: "100 Mbps",
      subscribed_date: "2026-01-20",
      status: "expired",
    },
    {
      subscription_id: 4,
      user_name: "Sarah Wilson",
      phone_number: "9876543213",
      plan_name: "Premium",
      price: 599,
      speed: "50 Mbps",
      subscribed_date: "2026-01-25",
      status: "active",
    },
    {
      subscription_id: 5,
      user_name: "David Brown",
      phone_number: "9876543214",
      plan_name: "Enterprise",
      price: 1999,
      speed: "200 Mbps",
      subscribed_date: "2026-01-30",
      status: "active",
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setSubscriptions(dummySubscriptions);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <>
      <Sidebar />
      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Subscribed Users</h1>
          </div>
          <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 font-semibold">S.No</th>
                  <th className="px-4 py-2 font-semibold">User Name</th>
                  <th className="px-4 py-2 font-semibold">Mobile</th>
                  <th className="px-4 py-2 font-semibold">Plan Name</th>
                  <th className="px-4 py-2 font-semibold">Plan Price</th>
                  <th className="px-4 py-2 font-semibold">Speed</th>
                  <th className="px-4 py-2 font-semibold">Subscribed Date</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
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
                  subscriptions.map((subscription, idx) => (
                    <tr
                      key={subscription.subscription_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{subscription.user_name}</td>
                      <td className="px-4 py-2">{subscription.phone_number}</td>
                      <td className="px-4 py-2">{subscription.plan_name}</td>
                      <td className="px-4 py-2">
                        <span className="text-green-600 font-semibold">
                          ₹{subscription.price}
                        </span>
                      </td>
                      <td className="px-4 py-2">{subscription.speed}</td>
                      <td className="px-4 py-2">
                        {subscription.subscribed_date
                          ? new Date(
                              subscription.subscribed_date,
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subscription.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subscribed;
