import React from 'react';
import { Users, UserPlus, Search } from 'lucide-react';

const ClientsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-primary-600" /> Clientes
          </h1>
          <p className="text-slate-500">Gestiona la base de datos de tus prestatarios</p>
        </div>
        <button className="btn-primary">
          <UserPlus size={18} /> Nuevo Cliente
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..." 
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 font-semibold text-slate-700">Nombre</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Documento</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Teléfono</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Estado</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Table rows would go here */}
            <tr>
              <td className="px-6 py-8 text-center text-slate-400" colSpan={5}>
                No hay clientes registrados todavía.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
