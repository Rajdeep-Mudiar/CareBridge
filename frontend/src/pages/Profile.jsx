import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../auth/ThemeContext';
import { User as UserIcon, Mail, Shield, Calendar, Moon, Sun, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6 transition-colors duration-500 light:bg-slate-50 light:text-slate-900">
      <Link to="/dashboard" className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </Link>
      
      <div className="max-w-2xl w-full bg-slate-900 rounded-3xl border border-slate-800 p-10 shadow-2xl overflow-hidden relative light:bg-white light:border-slate-200">
        <button 
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors z-20 light:bg-slate-100 light:hover:bg-slate-200"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button><div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-600 to-primary-900 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center">
            <img 
              src={user?.profilePicture} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-slate-950 shadow-xl"
            />
            <h2 className="text-3xl font-bold mt-4">{user?.name}</h2>
            <div className="inline-flex items-center px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm font-medium border border-primary-500/20 mt-2 capitalize">
              {user?.role}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <Mail className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Email Address</p>
                  <p className="text-lg font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <Calendar className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Joined On</p>
                  <p className="text-lg font-medium">Feb 10, 2026</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <Shield className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Account Status</p>
                  <p className="text-lg font-medium text-emerald-400">Verified</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl">
                  <UserIcon className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Employee ID</p>
                  <p className="text-lg font-medium">CB-{user?._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
             <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-semibold">
               Edit Profile
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
