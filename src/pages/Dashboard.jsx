import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar.jsx";

function Dashboard() {
  const [currentDate] = useState(new Date());

  const offers = [
    {
      title: "20% Off First Recharge",
      description: "Get 20% discount on your first mobile recharge",
      discount: "20%",
      color: "from-blue-500 to-blue-600",
      icon: "fa-solid fa-tag",
      updated: "last week"
    },
    {
      title: "Flat ₹50 Cashback",
      description: "Cashback on recharges above ₹500",
      discount: "₹50",
      color: "from-orange-500 to-orange-600",
      icon: "fa-solid fa-wallet",
      updated: "last month"
    },
    {
      title: "Premium Plan 30% Off",
      description: "Special discount on annual premium plans",
      discount: "30%",
      color: "from-pink-500 to-pink-600",
      icon: "fa-solid fa-star",
      updated: "last week"
    }
  ];

  const [applicants] = useState([
    { name: "Rahul Sharma", joinedDate: "2 weeks ago", plan: "BSNL Fiber 100Mbps" },
    { name: "Priya Patel", joinedDate: "1 week ago", plan: "Jio AirFiber 300Mbps" },
    { name: "Amit Kumar", joinedDate: "5 days ago", plan: "Airtel Xstream 200Mbps" },
    { name: "Sneha Reddy", joinedDate: "3 days ago", plan: "ACT Fibernet 150Mbps" },
    { name: "Vikram Singh", joinedDate: "1 day ago", plan: "BSNL Fiber 50Mbps" },
  ]);

  const recruitmentProgress = [
    { name: "Arjun Mehta", position: "BSNL 200Mbps", stage: "Active", stageColor: "bg-green-100 text-green-700" },
    { name: "Kavya Nair", position: "Jio AirFiber 1Gbps", stage: "Active", stageColor: "bg-green-100 text-green-700" },
    { name: "Rohan Kapoor", position: "Airtel 300Mbps", stage: "Pending", stageColor: "bg-yellow-100 text-yellow-700" },
    { name: "Ananya Das", position: "ACT 150Mbps", stage: "Active", stageColor: "bg-green-100 text-green-700" },
  ];

  const availablePlans = [
    { 
      provider: "BSNL", 
      speed: "100Mbps", 
      price: "₹449/month", 
      color: "from-blue-500 to-blue-600",
      icon: "fa-solid fa-wifi"
    },
    { 
      provider: "Jio AirFiber", 
      speed: "300Mbps", 
      price: "₹999/month", 
      color: "from-purple-500 to-purple-600",
      icon: "fa-solid fa-tower-broadcast"
    },
    { 
      provider: "Airtel Xstream", 
      speed: "200Mbps", 
      price: "₹799/month", 
      color: "from-red-500 to-red-600",
      icon: "fa-solid fa-signal"
    },
    { 
      provider: "ACT Fibernet", 
      speed: "150Mbps", 
      price: "₹599/month", 
      color: "from-green-500 to-green-600",
      icon: "fa-solid fa-network-wired"
    },
  ];

  const salesData = [
    { name: "BSNL", value: 35, color: "#3B82F6" },
    { name: "Jio", value: 28, color: "#9333EA" },
    { name: "Airtel", value: 22, color: "#EF4444" },
    { name: "ACT", value: 15, color: "#10B981" },
  ];

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
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8 pt-16 sm:pt-4 lg:pt-0">
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anything here"
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white/70 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm text-sm"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-sm">
                    <i className="fa-solid fa-bell text-gray-600"></i>
                  </button>
                  <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-sm">
                    <i className="fa-solid fa-comment text-gray-600"></i>
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">Admin Panel</div>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                    A
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
              <div className="bg-blue-500 rounded-[2rem] p-6 relative overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <i className="fa-solid fa-users text-white text-xl"></i>
                    </div>
                    <i className="fa-solid fa-arrow-trend-up text-white/60 text-lg"></i>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">Total Users</h3>
                  <p className="text-white text-3xl sm:text-4xl font-bold">100+</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">+12.5%</span>
                    <span className="text-white/70 text-xs">from last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500 rounded-[2rem] p-6 relative overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <i className="fa-solid fa-user-check text-white text-xl"></i>
                    </div>
                    <i className="fa-solid fa-arrow-trend-up text-white/60 text-lg"></i>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">Active Users</h3>
                  <p className="text-white text-3xl sm:text-4xl font-bold">500+</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">+8.2%</span>
                    <span className="text-white/70 text-xs">from last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500 rounded-[2rem] p-6 relative overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <i className="fa-solid fa-layer-group text-white text-xl"></i>
                    </div>
                    <i className="fa-solid fa-arrow-trend-up text-white/60 text-lg"></i>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">Total Plans</h3>
                  <p className="text-white text-3xl sm:text-4xl font-bold">156</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">+15.8%</span>
                    <span className="text-white/70 text-xs">from last month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="xl:col-span-8 space-y-4 sm:space-y-6">
                {/* Available Plans Section */}
                <section className="bg-white/70 backdrop-blur-md rounded-[2rem] p-4 sm:p-6 border border-white/50 shadow-lg">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Available Plans</h2>
                    <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">View All</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availablePlans.map((plan, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-400"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                          <i className={`${plan.icon} text-xl`}></i>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-1 text-gray-800">{plan.provider}</h3>
                        <div className="text-2xl font-bold text-indigo-600 mb-2">{plan.speed}</div>
                        <p className="text-lg font-semibold text-gray-700">{plan.price}</p>
                        
                       
                      </div>
                    ))}
                  </div>
                </section>

                {/* Offers Section */}
                <section className="bg-white/70 backdrop-blur-md rounded-[2rem] p-4 sm:p-6 border border-white/50 shadow-lg">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Offers</h2>
                    <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">View All</button>
                  </div>

                  <div className="space-y-4">
                    {offers.map((offer, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-2xl bg-white border-2 border-blue-500 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 bg-gradient-to-r ${offer.color} rounded-xl flex items-center justify-center text-white`}>
                                <i className={`${offer.icon} text-lg`}></i>
                              </div>
                              <div className={`text-3xl font-bold bg-gradient-to-r ${offer.color} bg-clip-text text-transparent`}>
                                {offer.discount}
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold mb-1 text-gray-800">{offer.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                Updated {offer.updated}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              
                
              </div>

              {/* Right Column */}
              <div className="xl:col-span-4 space-y-4 sm:space-y-6">
                {/* Sales by Product Pie Chart */}
                <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-4 sm:p-6 border border-white/50 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Sales by Product</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {salesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {salesData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Members */}
                <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-4 sm:p-6 border border-white/50 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">New Members</h2>
                    <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">View All</button>
                  </div>
                  <div className="space-y-3">
                    {applicants.map((person, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition bg-white">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {person.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{person.name}</div>
                          <div className="text-sm text-gray-600 mt-0.5">{person.plan}</div>
                          <div className="text-xs text-gray-500 mt-1">Joined {person.joinedDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;