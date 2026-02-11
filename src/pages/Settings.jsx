import React, { useState, useEffect } from "react";


function Settings() {
  const [settings, setSettings] = useState({
    id: null,
    primary_number: "",
    secondary_number: "",
    whatsapp_number: "",
    email_id: "",
    company_name: "",
    theme: "light",
    primaryColor: "blue",
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSMSAlerts: false,
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/settings`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await res.json();

      // If settings exist, use the first one
      if (data && data.length > 0) {
        const dbSettings = data[0];
        setSettings((prev) => ({
          ...prev,
          id: dbSettings.id,
          primary_number: dbSettings.primary_number || "",
          secondary_number: dbSettings.secondary_number || "",
          whatsapp_number: dbSettings.whatsapp_number || "",
          email_id: dbSettings.email_id || "",
          company_name: dbSettings.company_name || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      alert("Failed to load settings from server");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const payload = {
        primary_number: settings.primary_number,
        secondary_number: settings.secondary_number,
        whatsapp_number: settings.whatsapp_number,
        email_id: settings.email_id,
        company_name: settings.company_name,
      };

      let res;
      if (settings.id) {
        // Update existing settings
        res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/settings/${settings.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        // Create new settings
        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await res.json();
      alert(data.message || "Settings saved successfully!");

      // Refresh settings from server
      await fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      setSettings({
        id: null,
        primary_number: "",
        secondary_number: "",
        whatsapp_number: "",
        email_id: "",
        company_name: "PrimeDesk",
        theme: "light",
        primaryColor: "blue",
        enableNotifications: true,
        enableEmailAlerts: true,
        enableSMSAlerts: false,
        autoBackup: true,
        backupFrequency: "daily",
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

  if (fetchLoading) {
    return (
      <>
        
        <div className="lg:ml-64 min-h-screen lg:p-4">
          <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading settings...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="lg:ml-64 min-h-screen lg:p-4">
        <div className="h-full lg:min-h-[calc(100vh-2rem)] bg-white/40 backdrop-blur-sm lg:rounded-[3rem] p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
                disabled={loading}
              >
                Reset to Default
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                disabled={loading}
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
                        value={settings.company_name}
                        onChange={(e) =>
                          handleSettingChange("company_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Primary Number
                      </label>
                      <input
                        type="text"
                        value={settings.primary_number}
                        onChange={(e) =>
                          handleSettingChange("primary_number", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter primary contact number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Secondary Number
                      </label>
                      <input
                        type="text"
                        value={settings.secondary_number}
                        onChange={(e) =>
                          handleSettingChange(
                            "secondary_number",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter secondary contact number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={settings.whatsapp_number}
                        onChange={(e) =>
                          handleSettingChange("whatsapp_number", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter WhatsApp number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Email ID
                      </label>
                      <input
                        type="email"
                        value={settings.email_id}
                        onChange={(e) =>
                          handleSettingChange("email_id", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
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
