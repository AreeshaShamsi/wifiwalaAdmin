import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

function Settings() {
  const [settings, setSettings] = useState({
    theme: "light",
    primaryColor: "blue",
    companyName: "PrimeDesk",
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSMSAlerts: false,
    autoBackup: true,
    backupFrequency: "daily",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    supportEmail: "support@primedesk.com",
    supportPhone: "+91 76681 29807",
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    // Here you would normally save to backend
    alert("Settings saved successfully!");
  };

  const resetSettings = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      setSettings({
        theme: "light",
        primaryColor: "blue",
        companyName: "PrimeDesk",
        enableNotifications: true,
        enableEmailAlerts: true,
        enableSMSAlerts: false,
        autoBackup: true,
        backupFrequency: "daily",
        timezone: "Asia/Kolkata",
        dateFormat: "DD/MM/YYYY",
        currency: "INR",
        supportEmail: "support@primedesk.com",
        supportPhone: "+91 76681 29807",
        maintenanceMode: false,
        maxLoginAttempts: 5,
        sessionTimeout: 60,
      });
      alert("Settings reset to default!");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "fa-solid fa-gear" },
    { id: "appearance", label: "Appearance", icon: "fa-solid fa-palette" },
    { id: "notifications", label: "Notifications", icon: "fa-solid fa-bell" },
    { id: "security", label: "Security", icon: "fa-solid fa-shield" },
    { id: "backup", label: "Backup", icon: "fa-solid fa-database" },
  ];

  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-600" },
    { value: "indigo", label: "Indigo", class: "bg-indigo-600" },
    { value: "purple", label: "Purple", class: "bg-purple-600" },
    { value: "green", label: "Green", class: "bg-green-600" },
    { value: "red", label: "Red", class: "bg-red-600" },
    { value: "orange", label: "Orange", class: "bg-orange-600" },
  ];

  return (
    <>
      <Sidebar />
      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
              >
                Reset to Default
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <i className={tab.icon}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">
                    General Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) =>
                          handleSettingChange("companyName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) =>
                          handleSettingChange("timezone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">
                          America/New_York
                        </option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) =>
                          handleSettingChange("dateFormat", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) =>
                          handleSettingChange("currency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) =>
                          handleSettingChange("supportEmail", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Support Phone
                      </label>
                      <input
                        type="text"
                        value={settings.supportPhone}
                        onChange={(e) =>
                          handleSettingChange("supportPhone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Appearance Settings
                  </h2>

                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Theme
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={settings.theme === "light"}
                          onChange={(e) =>
                            handleSettingChange("theme", e.target.value)
                          }
                          className="mr-2"
                        />
                        <span className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                          Light
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={settings.theme === "dark"}
                          onChange={(e) =>
                            handleSettingChange("theme", e.target.value)
                          }
                          className="mr-2"
                        />
                        <span className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-800 border border-gray-600 rounded"></div>
                          Dark
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Primary Color
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {colorOptions.map((color) => (
                        <label
                          key={color.value}
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="primaryColor"
                            value={color.value}
                            checked={settings.primaryColor === color.value}
                            onChange={(e) =>
                              handleSettingChange(
                                "primaryColor",
                                e.target.value,
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-12 h-12 ${color.class} rounded-lg border-4 ${
                              settings.primaryColor === color.value
                                ? "border-gray-800 scale-110"
                                : "border-transparent"
                            } transition-all`}
                          ></div>
                          <span className="text-xs mt-1">{color.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">
                          Receive notifications in the admin panel
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.enableNotifications}
                          onChange={(e) =>
                            handleSettingChange(
                              "enableNotifications",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Alerts</h3>
                        <p className="text-sm text-gray-600">
                          Get important updates via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.enableEmailAlerts}
                          onChange={(e) =>
                            handleSettingChange(
                              "enableEmailAlerts",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">SMS Alerts</h3>
                        <p className="text-sm text-gray-600">
                          Receive critical alerts via SMS
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.enableSMSAlerts}
                          onChange={(e) =>
                            handleSettingChange(
                              "enableSMSAlerts",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Security Settings
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) =>
                          handleSettingChange(
                            "maxLoginAttempts",
                            parseInt(e.target.value),
                          )
                        }
                        min="3"
                        max="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of failed login attempts before account lockout
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "sessionTimeout",
                            parseInt(e.target.value),
                          )
                        }
                        min="15"
                        max="480"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Auto logout after inactivity period
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Maintenance Mode</h3>
                      <p className="text-sm text-gray-600">
                        Enable maintenance mode to restrict access
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          handleSettingChange(
                            "maintenanceMode",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Backup Tab */}
              {activeTab === "backup" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Backup Settings
                  </h2>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                    <div>
                      <h3 className="font-medium">Automatic Backup</h3>
                      <p className="text-sm text-gray-600">
                        Automatically backup data at scheduled intervals
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) =>
                          handleSettingChange("autoBackup", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Backup Frequency
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) =>
                        handleSettingChange("backupFrequency", e.target.value)
                      }
                      disabled={!settings.autoBackup}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-3">
                      Create Backup Now
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Download Latest Backup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
