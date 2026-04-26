import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Landmark, Calendar, AlertCircle, CheckCircle2, ChevronLeft, CreditCard, Clock, Edit3, DollarSign, List, History } from 'lucide-react';
import api from '../api/api';

const LoanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cuotas' | 'historial'>('cuotas');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loanRes, paymentsRes] = await Promise.all([
        api.get(`/loans/${id}`),
        api.get(`/loans/${id}/payments`)
      ]);
      setLoan(loanRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error('Error fetching loan details:', err);
      alert('Error cargando los detalles del préstamo.');
      navigate('/loans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loan) return null;

  const hasPayments = payments.length > 0;
  const progress = ((loan.totalToPay - loan.balanceDue) / loan.totalToPay) * 100;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={() => navigate('/loans')}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-2 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Volver a Préstamos
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              {loan.clientName.charAt(0)}
            </div>
            {loan.clientName}
          </h1>
          <p className="text-slate-500 font-medium mt-1 ml-16">Préstamo #{loan.id.toString().padStart(4, '0')} • Creado el {new Date(loan.startDate).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/loans/edit/${loan.id}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all"
          >
            <Edit3 size={18} /> Editar
          </button>
          {loan.status !== 'Cancelled' && loan.status !== 'Paid' && (
            <button 
              onClick={() => navigate(`/payments?loanId=${loan.id}`)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all transform active:scale-95"
            >
              <DollarSign size={18} /> Realizar Cobro
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Monto Principal</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${loan.amount.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tasa / Frecuencia</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{loan.interestRate}% <span className="text-sm text-slate-400 font-medium">/ {loan.frequency}</span></p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 md:col-span-2 relative overflow-hidden flex items-center justify-between">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Saldo Restante</p>
            <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">${loan.balanceDue.toLocaleString()}</p>
          </div>
          <div className="text-right">
             <span className={`px-4 py-2 rounded-full text-xs font-black uppercase border inline-block ${
                loan.status === 'Cancelled' ? 'bg-slate-50 text-slate-500 border-slate-200' : 
                loan.status === 'Paid' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                loan.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 
                'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {loan.status === 'Cancelled' ? 'Anulado' : loan.status === 'Paid' ? 'Pagado' : loan.status === 'Overdue' ? 'En Mora' : 'Activo'}
            </span>
            <p className="text-xs font-bold text-slate-400 mt-2">{Math.round(progress)}% Pagado</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex bg-slate-50 dark:bg-slate-800/50 m-6 rounded-2xl p-1">
           <button 
              onClick={() => setActiveTab('cuotas')}
              className={`flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'cuotas' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <List size={18} /> Cuotas Programadas
            </button>
            <button 
              onClick={() => setActiveTab('historial')}
              className={`flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'historial' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <History size={18} /> Historial de Pagos
            </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'cuotas' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-[10px] uppercase font-black tracking-widest text-slate-400">
                  <th className="px-8 py-5">Cuota #</th>
                  <th className="px-8 py-5">Fecha de Vencimiento</th>
                  <th className="px-8 py-5">Monto</th>
                  <th className="px-8 py-5">Pagado</th>
                  <th className="px-8 py-5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loan.installments.map((inst: any) => (
                  <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{inst.installmentNumber}</td>
                    <td className="px-8 py-6 text-slate-600 dark:text-slate-300">
                      {new Date(inst.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">${inst.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-emerald-600 font-bold">${inst.paidAmount.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                        inst.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        inst.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' :
                        inst.status === 'Partial' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {inst.status === 'Paid' ? 'Pagada' : inst.status === 'Overdue' ? 'Vencida' : inst.status === 'Partial' ? 'Parcial' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-[10px] uppercase font-black tracking-widest text-slate-400">
                  <th className="px-8 py-5">ID Recibo</th>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5">Monto Pagado</th>
                  <th className="px-8 py-5">Método</th>
                  <th className="px-8 py-5">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {payments.length > 0 ? payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-6 font-bold text-slate-500 text-xs">#{payment.id.toString().padStart(6, '0')}</td>
                    <td className="px-8 py-6 text-slate-900 dark:text-white font-medium">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 font-black text-emerald-600 dark:text-emerald-400">+${payment.amount.toLocaleString()}</td>
                    <td className="px-8 py-6 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                        <CreditCard size={12} /> {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 text-sm italic max-w-xs truncate" title={payment.notes}>
                      {payment.notes || '-'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <History size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-500">Sin historial de pagos</h3>
                      <p className="text-slate-400 text-sm mt-1">Este préstamo aún no ha recibido ningún abono.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsPage;
