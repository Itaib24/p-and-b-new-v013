import React, { useState } from 'react';
import { UserPlus, Search, Filter, MoreVertical, Edit2, Trash2, Shield, ChevronUp, ChevronDown, Users } from 'lucide-react';
import { TrainerAnalyticsDashboard } from './TrainerAnalyticsDashboard';
import { useAdmin } from '../../contexts/AdminContext';
import { calculateTrainerAnalytics } from '../../utils/trainerAnalytics';

export const AdminTrainers: React.FC = () => {
  const [showNewTrainerForm, setShowNewTrainerForm] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('performance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const { trainers, users, workoutLogs } = useAdmin();

  const handleTrainerClick = (trainerId: string) => {
    setSelectedTrainerId(trainerId);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter trainers based on search term
  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort trainers based on sort field and direction
  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    const analyticsA = calculateTrainerAnalytics(a, users, workoutLogs);
    const analyticsB = calculateTrainerAnalytics(b, users, workoutLogs);
    
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'role') {
      comparison = a.role.localeCompare(b.role);
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField === 'trainees') {
      comparison = analyticsA.activeClients - analyticsB.activeClients;
    } else if (sortField === 'performance') {
      comparison = analyticsA.avgClientProgress - analyticsB.avgClientProgress;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (selectedTrainerId) {
    return (
      <TrainerAnalyticsDashboard
        trainerId={selectedTrainerId}
        onBack={() => setSelectedTrainerId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">Trainers Management</h2>
        <button
          onClick={() => setShowNewTrainerForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-200 shadow-md"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search trainers..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-700 bg-gray-800 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-800 focus:ring-opacity-50 text-gray-200 transition-all duration-200"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              &times;
            </button>
          )}
        </div>
        <button className="px-4 py-2 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-700 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 text-gray-200">
          <Filter className="h-5 w-5 text-gray-400" />
          <span>Filters</span>
        </button>
      </div>

      {/* Trainers Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden border-2 border-gray-700 transform hover:border-purple-700 transition-all duration-300">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors duration-200"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center">
                  <span>Trainer</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors duration-200"
                onClick={() => toggleSort('role')}
              >
                <div className="flex items-center">
                  <span>Role</span>
                  {sortField === 'role' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors duration-200"
                onClick={() => toggleSort('status')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors duration-200"
                onClick={() => toggleSort('trainees')}
              >
                <div className="flex items-center">
                  <span>Trainees</span>
                  {sortField === 'trainees' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors duration-200"
                onClick={() => toggleSort('performance')}
              >
                <div className="flex items-center">
                  <span>Performance</span>
                  {sortField === 'performance' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedTrainers.map((trainer) => {
              const analytics = calculateTrainerAnalytics(trainer, users, workoutLogs);
              
              return (
                <tr 
                  key={trainer.id} 
                  className="hover:bg-gray-700/50 cursor-pointer group transition-colors duration-200"
                  onClick={() => handleTrainerClick(trainer.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                        <img
                          src={trainer.avatar}
                          alt={trainer.name}
                          className="relative h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200 group-hover:text-purple-300 transition-colors duration-200">
                          {trainer.name}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                          {trainer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200 bg-gray-800 px-3 py-1.5 rounded-lg inline-block shadow-inner border border-gray-700">
                      {trainer.role === 'senior_trainer' ? 'Senior Trainer' :
                       trainer.role === 'junior_trainer' ? 'Junior Trainer' :
                       'Nutrition Specialist'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex text-xs font-medium rounded-full shadow-md ${
                      trainer.status === 'active' ? 'bg-gradient-to-r from-green-800 to-green-700 text-green-200 border border-green-700' :
                      trainer.status === 'inactive' ? 'bg-gradient-to-r from-red-800 to-red-700 text-red-200 border border-red-700' :
                      'bg-gradient-to-r from-yellow-800 to-yellow-700 text-yellow-200 border border-yellow-700'
                    }`}>
                      {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium bg-gray-700 px-3 py-1.5 rounded-full inline-flex items-center gap-1 shadow-inner border border-gray-600">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-200">{analytics.activeClients}</span>
                      <span className="text-gray-400">active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2.5 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full ${
                            analytics.avgClientProgress >= 80 ? 'bg-gradient-to-r from-green-600 to-green-500' :
                            analytics.avgClientProgress >= 70 ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                            'bg-gradient-to-r from-red-600 to-red-500'
                          }`}
                          style={{ width: `${analytics.avgClientProgress}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                        analytics.avgClientProgress >= 80 ? 'bg-green-900/70 text-green-200 border border-green-700/50' :
                        analytics.avgClientProgress >= 70 ? 'bg-blue-900/70 text-blue-200 border border-blue-700/50' :
                        'bg-red-900/70 text-red-200 border border-red-700/50'
                      }`}>
                        {Math.round(analytics.avgClientProgress)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 hover:bg-purple-900/70 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                        title="Edit trainer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-red-900/70 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        title="Delete trainer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Empty state */}
        {sortedTrainers.length === 0 && (
          <div className="py-12 text-center">
            <div className="p-6 bg-gray-800/80 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-4 border border-gray-700">
              <Shield className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No trainers found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm ? 
                `No trainers match "${searchTerm}". Try a different search term.` : 
                "There are no trainers in the system yet. Add your first trainer to get started."}
            </p>
          </div>
        )}
      </div>

      {/* New Trainer Form Modal */}
      {showNewTrainerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl border-2 border-purple-700">
            <h3 className="text-xl font-semibold text-gray-200 mb-6 bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">
              Add New Trainer
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-700 bg-gray-800/80 rounded-lg text-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-800/50 focus:ring-opacity-50 shadow-inner"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border-2 border-gray-700 bg-gray-800/80 rounded-lg text-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-800/50 focus:ring-opacity-50 shadow-inner"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select className="w-full p-3 border-2 border-gray-700 bg-gray-800/80 rounded-lg text-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-800/50 focus:ring-opacity-50 shadow-inner">
                  <option value="senior_trainer">Senior Trainer</option>
                  <option value="junior_trainer">Junior Trainer</option>
                  <option value="nutrition_specialist">Nutrition Specialist</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTrainerForm(false)}
                    className="px-6 py-2.5 text-gray-300 hover:text-gray-100 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-200 font-medium shadow-md border-b border-purple-900"
                  >
                    Add Trainer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};