import React from 'react';
import { Settings, Bell, Shield, Database, Mail, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [showSaveSuccess, setShowSaveSuccess] = React.useState(false);
  
  const handleSaveSettings = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };
  
  return (
    <div className="space-y-6">
      {/* Settings Header with Action */}
      <div className="flex items-center justify-between bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-purple-700">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900 to-purple-800">
            <Settings className="h-6 w-6 text-purple-300" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">System Settings</h2>
        </div>
        
        <button 
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 font-medium shadow-md border-b border-green-800 flex items-center gap-2"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Success Message */}
      {showSaveSuccess && (
        <div className="bg-gradient-to-r from-green-800 to-green-900 text-green-200 px-4 py-3 rounded-lg flex items-center gap-3 border border-green-700 animate-fade-in-up shadow-md">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-gray-700">
        <div className="space-y-8">
          {/* Notifications */}
          <div className="border-b border-gray-700 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-900/80">
                <Bell className="h-5 w-5 text-amber-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-200">Notifications</h3>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-amber-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Email Notifications</div>
                    <div className="text-sm text-gray-400">Receive system alerts via email</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-purple-500"></div>
                  </label>
                </div>
                <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>Email notifications help you stay informed about important system events</span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-amber-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">System Alerts</div>
                    <div className="text-sm text-gray-400">Important system notifications</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-purple-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-amber-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Push Notifications</div>
                    <div className="text-sm text-gray-400">Instant alerts on your device</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="border-b border-gray-700 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-900/80">
                <Shield className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-200">Security</h3>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Additional security for your account</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500"></div>
                  </label>
                </div>
                <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Highly recommended for admin accounts</span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">API Access</div>
                    <div className="text-sm text-gray-400">Enable API access for integrations</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500"></div>
                  </label>
                </div>
                <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>API keys can be generated in the API settings section</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Session Timeout</div>
                    <div className="text-sm text-gray-400">Automatically log out inactive users</div>
                  </div>
                  <select className="p-2 border-2 border-gray-700 bg-gray-800 rounded-lg text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-800/50">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="border-b border-gray-700 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-900/80">
                <Database className="h-5 w-5 text-green-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-200">Data Management</h3>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Automatic Backups</div>
                    <div className="text-sm text-gray-400">Daily system backups</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-green-500"></div>
                  </label>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Last backup: Today at 03:15 AM</span>
                  </div>
                  <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200">
                    View backups
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Data Analytics</div>
                    <div className="text-sm text-gray-400">Collect anonymous usage data</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-green-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-700/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Data Retention Policy</div>
                    <div className="text-sm text-gray-400">How long to keep user data</div>
                  </div>
                  <select className="p-2 border-2 border-gray-700 bg-gray-800 rounded-lg text-gray-200 focus:border-green-500 focus:ring focus:ring-green-800/50">
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="730">2 years</option>
                    <option value="0">Forever</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-900/80">
                <Mail className="h-5 w-5 text-indigo-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-200">Email Settings</h3>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 hover:border-indigo-700/50 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      System Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="system@raeda-ai.com"
                      className="w-full p-3 border-2 border-gray-700 bg-gray-800/80 rounded-lg text-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-800/50 focus:ring-opacity-50 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email Template Directory
                    </label>
                    <input
                      type="text"
                      defaultValue="/templates/email/"
                      className="w-full p-3 border-2 border-gray-700 bg-gray-800/80 rounded-lg text-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-800/50 focus:ring-opacity-50 shadow-inner"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 hover:border-indigo-700/50 transition-all duration-300">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Test
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      placeholder="Enter email for test"
                      className="flex-1 p-3 border-2 border-gray-700 bg-gray-800/80 rounded-lg text-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-800/50 focus:ring-opacity-50 shadow-inner"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 shadow-md border-b border-indigo-800">
                      Send Test
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">SMTP Authentication</div>
                    <div className="text-sm text-gray-400">Use secure SMTP for sending emails</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-indigo-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};