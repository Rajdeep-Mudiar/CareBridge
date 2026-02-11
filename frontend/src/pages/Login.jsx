import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Activity, Shield, Zap } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-900 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600/20 rounded-xl border border-primary-500/30">
              <Activity className="w-10 h-10 text-primary-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">CareBridge</h1>
          <p className="mt-2 text-slate-400">AI-Powered 3D Digital Twin Healthcare</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <Shield className="w-5 h-5 text-primary-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-200">Secure & Private</h3>
                <p className="text-xs text-slate-500">Your health data is encrypted and protected.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <Zap className="w-5 h-5 text-primary-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-200">Real-time Insights</h3>
                <p className="text-xs text-slate-500">AI-driven diagnostics and 3D visualization.</p>
              </div>
            </div>
          </div>

          <button
            onClick={login}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-600/20"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              className="w-5 h-5 mr-3 bg-white p-0.5 rounded-sm" 
              alt="Google" 
            />
            Sign in with Google
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
            The future of healthcare is here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
