import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Filter, Search, Calendar, ChevronRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const LoansPage: React.FC = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get(`/loans`);
      setLoans(response.data);
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total en Calle', value: loans.reduce((acc, l) => acc + l.balanceDue, 0), icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Intereses', value: loans.reduce((acc, l) => acc + (l.totalToPay - l.amount), 0), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'En Mora', value: loans.filter(l => l.status === 'Overdue').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const filteredLoans = loans.filter(l => 
    l.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 mb-10">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
            <Filter size={18} /> Filtros
          </button>
          <button 
            onClick={() => navigate('/loans/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all transform active:scale-95"
          >
            <Plus size={20} /> Nuevo Préstamo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.bg} dark:bg-opacity-10 rounded-2xl flex items-center justify-center`}>
              <stat.icon className={stat.color} size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {typeof stat.value === 'number' && stat.label !== 'En Mora' 
                  ? `$${stat.value.toLocaleString()}` 
                  : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por cliente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-[10px] uppercase font-black tracking-widest text-slate-400">
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">Préstamo</th>
                <th className="px-8 py-5">Progreso</th>
                <th className="px-8 py-5">Saldo</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium italic">Sincronizando cartera...</p>
                  </td>
                </tr>
              ) : filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const progress = ((loan.totalToPay - loan.balanceDue) / loan.totalToPay) * 100;
                  return (
                    <tr key={loan.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {loan.clientName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{loan.clientName}</p>
                            <p className="text-[10px] text-slate-500 font-medium">#{loan.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-700 dark:text-slate-300">${loan.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar size={10} /> {loan.frequency}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-32">
                          <div className="flex justify-between mb-1">
                            <span className="text-[9px] font-black text-slate-400">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${loan.status === 'Overdue' ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 dark:text-white">${loan.balanceDue.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                          loan.status === 'Overdue' 
                            ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                        }`}>
                          {loan.status === 'Overdue' ? 'En Mora' : 'Al Día'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">Sin préstamos activos</h3>
                    <p className="text-slate-400 text-sm mt-1">Todo está en orden por aquí.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
