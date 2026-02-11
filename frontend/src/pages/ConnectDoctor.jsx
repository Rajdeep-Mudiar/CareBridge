import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../auth/ThemeContext';
import { Activity, User as UserIcon, LogOut, Moon, Sun, Video, Phone, MessageCircle, Star } from 'lucide-react';

const ConnectDoctor = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Miller',
      specialty: 'Cardiologist',
      rating: 4.9,
      experience: '15 years',
      availability: 'Available Now',
      status: 'online',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: 2,
      name: 'Dr. James Wilson',
      specialty: 'General Physician',
      rating: 4.8,
      experience: '12 years',
      availability: 'Next: 2:00 PM',
      status: 'busy',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      specialty: 'Neurologist',
      rating: 5.0,
      experience: '18 years',
      availability: 'Available Now',
      status: 'online',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
    },
    {
      id: 4,
      name: 'Dr. Michael Brown',
      specialty: 'Pulmonologist',
      rating: 4.7,
      experience: '10 years',
      availability: 'Tomorrow 9:00 AM',
      status: 'offline',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    }
  ];

  const specialties = ['All', 'Cardiologist', 'General Physician', 'Neurologist', 'Pulmonologist'];

  const filteredDoctors = selectedSpecialty && selectedSpecialty !== 'All'
    ? availableDoctors.filter(doc => doc.specialty === selectedSpecialty)
    : availableDoctors;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:block transition-colors duration-300">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-10">
            <Activity className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold tracking-tight">CareBridge</span>
          </div>

          <nav className="space-y-2 flex-1">
            <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Health Profile</span>
            </Link>
            <Link to="/connect-doctor" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary-600/10 text-primary-500 dark:text-primary-400 border border-primary-500/20">
              <Video className="w-5 h-5" />
              <span className="font-medium">Connect to Doctor</span>
            </Link>
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Connect to a Doctor</h1>
            <p className="text-slate-400">Book a consultation with our expert physicians</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-500">ID: {user?._id.slice(-6)}</p>
            </div>
            <img 
              src={user?.profilePicture} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-primary-500/30"
            />
          </div>
        </header>

        {/* Specialty Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedSpecialty === specialty || (!selectedSpecialty && specialty === 'All')
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary-500/50'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-2xl hover:border-primary-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800"
                />
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{doctor.rating}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{doctor.name}</h3>
              <p className="text-sm text-primary-500 font-medium mb-2">{doctor.specialty}</p>
              <p className="text-xs text-slate-500 mb-4">{doctor.experience} experience</p>

              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  doctor.status === 'online' ? 'bg-emerald-500' :
                  doctor.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <span className="text-sm text-slate-600 dark:text-slate-400">{doctor.availability}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors">
                  <Video className="w-4 h-4" />
                  <span className="text-xs font-medium">Video</span>
                </button>
                <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-medium">Call</span>
                </button>
                <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-600 dark:to-pink-600 rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Emergency?</h3>
              <p className="text-white/90">Call our 24/7 emergency hotline</p>
            </div>
            <button className="bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-rose-50 transition-colors flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConnectDoctor;
