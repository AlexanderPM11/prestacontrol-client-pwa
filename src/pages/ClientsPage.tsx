import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Phone, Shield, MoreVertical, Edit3, Trash2, Mail } from 'lucide-react';
import axios from 'axios';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.fullName.toLowerCase().includes(search.toLowerCase()) || 
    c.documentId.includes(search)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 mb-10">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/30 transition-all transform active:scale-95">
          <UserPlus size={20} /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-8">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, documento o teléfono..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-8 py-5 font-bold text-[10px] uppercase tracking-widest text-slate-400">Cliente</th>
                <th className="px-8 py-5 font-bold text-[10px] uppercase tracking-widest text-slate-400">Documento</th>
                <th className="px-8 py-5 font-bold text-[10px] uppercase tracking-widest text-slate-400">Contacto</th>
                <th className="px-8 py-5 font-bold text-[10px] uppercase tracking-widest text-slate-400">Estado</th>
                <th className="px-8 py-5 font-bold text-[10px] uppercase tracking-widest text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Cargando base de datos...</p>
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                          {client.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-lg">{client.fullName}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Shield size={12} className="text-indigo-400" /> Miembro desde 2024
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                        {client.documentId}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" /> {client.phone}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" /> sin@correo.com
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-200 dark:border-emerald-800">
                        ACTIVO
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 rounded-xl transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700">
                      <Users size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">Sin resultados</h3>
                    <p className="text-slate-400 text-sm mt-1">No se encontraron clientes que coincidan con tu búsqueda.</p>
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

export default ClientsPage;
