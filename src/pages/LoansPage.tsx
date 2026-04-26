import React from 'react';
import { Landmark, Plus, Filter } from 'lucide-react';

const LoansPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="text-primary-600" /> Préstamos
          </h1>
          <p className="text-slate-500">Control de créditos activos y finalizados</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filtros
          </button>
          <button className="btn-primary">
            <Plus size={18} /> Nuevo Préstamo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-l-4 border-l-primary-500">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Total en Calle</p>
          <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
        </div>
        <div className="card border-l-4 border-l-financial-green">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Intereses Generados</p>
          <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
        </div>
        <div className="card border-l-4 border-l-financial-red">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Mora Acumulada</p>
          <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-100">
              <th className="px-6 py-4 font-semibold text-slate-700">Cliente</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Monto</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Fecha</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Estado</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-8 text-center text-slate-400" colSpan={5}>
                No hay préstamos registrados todavía.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoansPage;
