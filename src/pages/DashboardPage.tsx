import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, DollarSign, LogOut, Menu, AlertTriangle, PlusCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Dinero Prestado', value: '$25,000', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Dinero Cobrado', value: '$12,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Clientes Activos', value: '48', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const quickActions = [
    { label: 'Nuevo Préstamo', icon: PlusCircle, path: '/loans/new', color: 'bg-blue-600' },
    { label: 'Registrar Pago', icon: DollarSign, path: '/payments', color: 'bg-emerald-600' },
    { label: 'Ver Morosos', icon: AlertTriangle, path: '/loans/delinquent', color: 'bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-slate-900 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">PrestaControl</span>
        </div>
        <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <main className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Hola, {user?.fullName}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Panel de control operativo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <div className={`p-3 ${action.color} text-white rounded-xl shadow-lg transition-transform group-hover:scale-110`}>
                  <action.icon size={20} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity / Agenda */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" /> Agenda de Hoy
            </h3>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full">3 PENDIENTES</span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Menu size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Sin actividad registrada para hoy</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-8 py-3 flex justify-between items-center z-10 md:px-32">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-blue-600">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">Inicio</span>
        </Link>
        <Link to="/clients" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors">
          <Users size={20} />
          <span className="text-[10px] font-bold">Clientes</span>
        </Link>
        <Link to="/loans" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors">
          <CreditCard size={20} />
          <span className="text-[10px] font-bold">Préstamos</span>
        </Link>
        <Link to="/payments" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors">
          <DollarSign size={20} />
          <span className="text-[10px] font-bold">Cobros</span>
        </Link>
      </nav>
    </div>
  );
};

export default DashboardPage;
