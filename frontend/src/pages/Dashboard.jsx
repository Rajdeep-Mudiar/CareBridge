import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../auth/ThemeContext';
import { LogOut, User as UserIcon, Activity, Heart, Thermometer, Droplets, Bell, Moon, Sun, Video, Brain, Download, Stethoscope, TrendingUp, Sparkles } from 'lucide-react';
import AICopilot from '../components/AICopilot';
import DigitalTwin3D from '../components/DigitalTwin3D';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const HealthScoreCircle = ({ score, change }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-48 h-48 transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{score}</span>
        <div className="flex items-center mt-1 text-emerald-500 font-bold">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+{change}%</span>
        </div>
        <span className="text-xs text-slate-500 uppercase tracking-widest mt-1">Health Score</span>
      </div>
    </div>
  );
};

const MiniLineChart = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 80}`).join(' ');

  return (
    <svg className="w-full h-12 overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-80"
      />
    </svg>
  );
};

const OrganStatusCard = ({ organ, status, value, icon: Icon }) => {
  const getStatusColor = (s) => {
    switch(s) {
      case 'optimal': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'clear': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all hover:border-primary-500/30">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{organ}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{value}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${getStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
};

const AIInsightsPanel = () => {
  const { theme } = useTheme();

  return (
    <div className={`p-6 rounded-3xl shadow-xl transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-primary-600 to-cyan-500 text-white' 
        : 'bg-gradient-to-br from-primary-50 to-cyan-50 border border-primary-100 text-slate-900 shadow-primary-500/5'
    }`}>
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-primary-600'}`} />
        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-primary-900'}`}>AI Health Insights</span>
      </div>
      <div className="space-y-4">
        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'opacity-90' : 'text-slate-600 font-medium'}`}>
          Your heart rhythm shows a 4% improvement in stability compared to last week. Keep up the consistent sleep schedule!
        </p>
        <Link 
          to="/analysis" 
          className={`inline-block text-xs font-bold border-b pb-0.5 transition-colors ${
            theme === 'dark' 
              ? 'border-white/40 hover:border-white text-white' 
              : 'border-primary-500/40 hover:border-primary-600 text-primary-600'
          }`}
        >
          See full analysis
        </Link>
      </div>
    </div>
  );
};

const HeartHealthPanel = () => {
  const heartRateData = [68, 72, 75, 71, 78, 72, 70, 73, 72, 74, 71, 72];
  const labels = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <span>Detailed Monitoring</span>
        </h3>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Optimal</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-slate-500 text-sm font-medium">Heart Rate Trend</p>
              <h4 className="text-3xl font-bold mt-1">72 <span className="text-sm text-slate-400 font-normal">bpm</span></h4>
            </div>
            <div className="text-right">
              <span className="text-emerald-500 font-bold text-sm">-2%</span>
              <p className="text-[10px] text-slate-400">lower than avg</p>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between space-x-2">
            {heartRateData.map((d, i) => (
              <div key={i} className="flex-1 h-full flex flex-col justify-end items-center group">
                <div 
                  className="w-full bg-rose-500/20 group-hover:bg-rose-500/40 transition-all rounded-t-lg relative"
                  style={{ height: `${d}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl z-20 whitespace-nowrap">
                    {d} BPM
                  </div>
                </div>
                <div className="h-8 flex items-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{labels[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-500 text-sm font-medium">Blood Pressure</p>
              <span className="text-blue-500 text-xs font-bold">Stable</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Systolic</p>
                <p className="text-xl font-bold">118 <span className="text-xs font-normal">mmHg</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Diastolic</p>
                <p className="text-xl font-bold">78 <span className="text-xs font-normal">mmHg</span></p>
              </div>
            </div>
          </div>
          <AIInsightsPanel />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const dashboardRef = React.useRef(null);

  const handleExportPDF = async () => {
    const element = dashboardRef.current;
    if (!element) return;

    try {
      // Use html-to-image which handles modern CSS (like oklch) better than html2canvas
      const dataUrl = await toPng(element, { cacheBust: true, backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc' });

      // Create PDF
      // Use standard A4 size or match content
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.scrollWidth, element.scrollHeight] // Match element size
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, element.scrollWidth, element.scrollHeight);
      pdf.save(`CareBridge-Health-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert(`Failed to export PDF: ${error.message}`);
    }
  };
  
  const [healthScore] = useState(85);
  const [scoreChange] = useState(12);
  
  // Organ health status - can be updated from backend API
  const [organStatus] = React.useState({
    brain: 'normal',
    heart: 'warning',
    lungs: 'normal',
    liver: 'normal'
  });
  
  const stats = [
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10', trend: [72, 75, 71, 78, 72, 70, 73, 72], change: '+2.4%' },
    { label: 'Temperature', value: '98.6 °F', icon: Thermometer, color: 'text-amber-400', bg: 'bg-amber-400/10', trend: [98.2, 98.4, 98.6, 98.5, 98.6, 98.7, 98.6, 98.6], change: '+0.1%' },
    { label: 'Blood Oxygen', value: '98%', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: [97, 98, 97, 98, 99, 98, 98, 98], change: '+1.0%' },
    { label: 'Activity', value: '8,432 steps', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: [6200, 7100, 8000, 7500, 8200, 8400, 8432, 8500], change: '+12.4%' },
  ];

  // Comprehensive alerts data
  const allAlerts = [
    { id: 1, title: 'Heart Rate Spike', time: '2 mins ago', type: 'critical', desc: 'AI suggests resting. Heart rate reached 125 bpm during light activity.', category: 'Heart Health' },
    { id: 2, title: 'Sleep Debt Detected', time: '1 hour ago', type: 'warning', desc: 'You slept only 5.5 hours. Consistency is key for optimal health.', category: 'Sleep' },
    { id: 3, title: 'Health Score: 85', time: '1 day ago', type: 'success', desc: 'You are doing great! Keep up the good work.', category: 'General' },
    { id: 4, title: 'Blood Pressure Elevated', time: '3 hours ago', type: 'warning', desc: 'BP reading: 138/88 mmHg. Monitor closely.', category: 'Heart Health' },
    { id: 5, title: 'Hydration Reminder', time: '5 hours ago', type: 'info', desc: 'You have only consumed 40% of your daily water goal.', category: 'Nutrition' },
    { id: 6, title: 'Exercise Goal Met', time: '8 hours ago', type: 'success', desc: 'Congratulations! You achieved 10,000 steps today.', category: 'Activity' },
    { id: 7, title: 'Medication Reminder', time: '12 hours ago', type: 'info', desc: 'Time to take your evening supplements.', category: 'Medication' },
    { id: 8, title: 'Oxygen Level Drop', time: '1 day ago', type: 'warning', desc: 'SpO2 dropped to 94% during sleep. Consider sleep study.', category: 'Respiratory' },
  ];

  // Show only top 3 recent alerts in sidebar
  const recentAlerts = allAlerts.slice(0, 3);

  const organDetails = {
    brain: {
      name: 'Brain',
      status: organStatus.brain === 'normal' ? 'Healthy' : organStatus.brain === 'warning' ? 'Warning' : 'Critical',
      details: 'Cognitive function normal. Sleep quality: Good (7.5hrs avg). Stress levels: Low.',
      color: 'text-purple-400'
    },
    heart: {
      name: 'Heart',
      status: organStatus.heart === 'normal' ? 'Excellent' : organStatus.heart === 'warning' ? 'Elevated' : 'Critical',
      details: 'Heart rate: 85 bpm (slightly elevated). Blood pressure: 135/85 mmHg. Consider reducing stress.',
      color: 'text-rose-400'
    },
    lungs: {
      name: 'Lungs',
      status: organStatus.lungs === 'normal' ? 'Good' : organStatus.lungs === 'warning' ? 'Warning' : 'Critical',
      details: 'Oxygen saturation: 98%. Respiratory rate: 16 breaths/min. Lung capacity: 95%.',
      color: 'text-blue-400'
    },
    liver: {
      name: 'Liver',
      status: organStatus.liver === 'normal' ? 'Normal' : organStatus.liver === 'warning' ? 'Warning' : 'Critical',
      details: 'Enzyme levels normal. No fatty deposits detected. Detoxification efficiency: 92%.',
      color: 'text-purple-400'
    }
  };

  const handleOrganClick = (organ) => {
    setSelectedOrgan(organ);
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

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
            <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary-600/10 text-primary-500 dark:text-primary-400 border border-primary-500/20">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">Health Profile</span>
            </Link>
            <Link to="/connect-doctor" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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
      <main className="lg:ml-64 p-8" ref={dashboardRef}>
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="text-slate-400">Your health overview for today.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Export Button */}
            <button 
              onClick={handleExportPDF}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors font-semibold text-sm text-slate-700 dark:text-slate-300"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6" />
              {allAlerts.filter(a => a.type === 'critical' || a.type === 'warning').length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
              {allAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {allAlerts.length}
                </span>
              )}
            </button>
            
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-500">ID: {user?._id.slice(-6)}</p>
            </div>
            <img 
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
              alt="Profile" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`;
              }}
              className="w-12 h-12 rounded-full border-2 border-primary-500/30"
            />
          </div>
        </header>

        {/* Notification Panel Modal */}
        {showNotifications && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Notification Panel */}
            <div className="fixed top-20 right-8 w-[500px] max-h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-5 duration-300">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Notifications</h3>
                  <p className="text-sm text-slate-500">You have {allAlerts.length} alerts</p>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Alerts List */}
              <div className="overflow-y-auto max-h-[450px] p-4 space-y-3">
                {allAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-primary-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                        alert.type === 'critical' ? 'bg-rose-500/10' :
                        alert.type === 'warning' ? 'bg-amber-500/10' :
                        alert.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                      }`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                            {alert.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            {alert.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                          {alert.desc}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            {alert.time}
                          </span>
                          <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            alert.type === 'critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                            alert.type === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                            alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              alert.type === 'critical' ? 'bg-rose-500' :
                              alert.type === 'warning' ? 'bg-amber-500' :
                              alert.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}></div>
                            <span className="uppercase">{alert.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex space-x-3">
                <button 
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors font-semibold text-sm"
                  onClick={() => setShowNotifications(false)}
                >
                  Mark All as Read
                </button>
                <button 
                  className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-semibold text-sm"
                  onClick={() => setShowNotifications(false)}
                >
                  Clear All
                </button>
              </div>
            </div>
          </>
        )}

        {/* Health Score */}
        <div className="flex justify-center mb-10">
          <HealthScoreCircle score={healthScore} change={scoreChange} />
        </div>

        {/* Stats Grid with Mini Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 transition-colors">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 mb-3 text-slate-900 dark:text-white transition-colors">{stat.value}</p>
              <MiniLineChart data={stat.trend} color={stat.color.replace('text-', '#').replace('-400', '')} />
            </div>
          ))}
        </div>

        {/* Digital Twin and Health Metrics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[600px] flex items-center justify-center relative overflow-hidden group transition-colors shadow-sm">
            <DigitalTwin3D 
              gender={user?.gender || 'male'} 
              onOrganClick={handleOrganClick}
              organStatus={organStatus}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 transition-colors">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2 text-slate-900 dark:text-white">
              <Bell className="w-5 h-5 text-primary-500" />
              <span>Recent Alerts</span>
            </h3>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-primary-500/30 transition-all cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                    alert.type === 'warning' ? 'bg-amber-500' : 
                    alert.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{alert.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.desc}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-full mt-4 px-4 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </div>

        {/* Organ Status Cards and Heart Health Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          {/* Organ Status Quick View */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Organ Status</h3>
            <OrganStatusCard organ="Heart" status="optimal" value="72 BPM" icon={Heart} />
            <OrganStatusCard organ="Lungs" status="clear" value="98% SpO2" icon={Droplets} />
            <OrganStatusCard organ="Brain" status="optimal" value="Rest Adv." icon={Brain} />
          </div>

          {/* Heart Health Detailed Panel */}
          <div className="xl:col-span-2">
            <HeartHealthPanel />
          </div>
        </div>

        {/* AI Copilot with Patient Context */}
        <AICopilot patientContext={{
          vitals: {
            heartRate: 72,
            bloodPressure: '118/78',
            oxygen: 98,
            temperature: 98.6,
            steps: 8432
          },
          healthScore: healthScore,
          scoreChange: scoreChange,
          organStatus: organStatus,
          recentAlerts: recentAlerts,
          userProfile: {
            name: user?.name,
            age: user?.age,
            gender: user?.gender || 'Not specified'
          }
        }} />

        {/* Organ Detail Modal */}
        {selectedOrgan && organDetails[selectedOrgan] && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrgan(null)}
          >
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-primary-500/30 p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${organDetails[selectedOrgan].color}`}>
                  {organDetails[selectedOrgan].name}
                </h3>
                <button
                  onClick={() => setSelectedOrgan(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    organStatus[selectedOrgan] === 'critical' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : organStatus[selectedOrgan] === 'warning'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    {organDetails[selectedOrgan].status}
                  </span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {organDetails[selectedOrgan].details}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedOrgan(null)}
                  className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
